import uvicorn
from fastapi import FastAPI, Depends
from fastapi.responses import HTMLResponse
import psycopg2

db_params = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "postgres",
    "port": "5432",
    "host": "db"
}

connection = psycopg2.connect(**db_params)
cursor = connection.cursor()

app = FastAPI()

@app.get("/")
def root():
    print('hello world')
    ret = '''
        <html>
        <body>
        <h1> Stock Portal </h1>
        <p> Options: </p>
        <ul>
            <li> /stocks To see actual prices</li>
            <li> /stocks/{symbol} To find a stock's history (max 100 entries) </li>
            <li> /stocks/{symbol}?page=X&size=Y To find a stock's history, choosing the X page of size Y </li>
        </ul>
        </body>
        </html>
    '''
    return HTMLResponse(content=ret)


@app.get("/stocks")
def stocks():
    response = ""
    # cursor.execute("SELECT shortname, price, currency FROM stocks")
    cursor.execute("SELECT DISTINCT symbol FROM stocks;")
    symbols = cursor.fetchall()
    ret='''
        <html>
        <body>
        <p>
    '''
    for symbol in symbols:
        # ret += f"{stock[3]}: {stock[4]} {stock[5]} <br>"
        cursor.execute("SELECT shortname, price, currency FROM stocks WHERE symbol = %s ORDER BY datetime DESC LIMIT 1;", (symbol[0],))
        stock = cursor.fetchone()
        ret += f"<h3>{symbol[0]}</h3>"
        ret += f"{stock[1]} {stock[2]} <br>"
    ret +='''
        </p>
        </body>
        </html>
        '''

    return HTMLResponse(content=ret)

@app.get("/stocks/{symbol}")
def get_stock(symbol: str, page: int = 1, size: int = 100):
    if page > 0 and size > 0:
        offset = (page - 1) * size
        cursor.execute("SELECT * FROM stocks WHERE symbol = %s LIMIT %s OFFSET %s", (symbol, size, offset))
        stocks = cursor.fetchall()
        ret = f'''
            <html>
            <body>
            <h1> {symbol} History </h1>
            <p> Prices in {stocks[0][5]} </p>
            '''
        for stock in stocks:
            ret += f"{stock[1]}:   {stock[4]} <br>"
        ret += '''
            </body>
            </html>
        '''
        return HTMLResponse(content=ret)
    return {"Data": "Invalid page or size"}

@app.post("/add_stocks")
def receive_data(item: dict):
    print("estoy recibiendo cosas")
    for stock in item["stocks"]:
        cursor.execute("INSERT INTO stocks (stock_id, datetime, symbol, shortname, price, currency, source) VALUES (%s, %s, %s, %s, %s, %s, %s);", (item['stocks_id'], item['datetime'], stock['symbol'], stock['shortName'], stock['price'], stock['currency'], stock['source']))
    connection.commit()
    return "OK"

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
