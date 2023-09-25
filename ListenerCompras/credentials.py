class Credentials:
    def __init__(self):
        self.credentials = {}
        self.archive = 'credentials.secret'
        self.load_credentials()
        self.load_extradata()

    def load_credentials(self):
        with open(self.archive, 'r') as file:
            lines = file.readlines()

        for line in lines:
            if '=' in line:
                key, value = line.strip().split('=')
                #HOST, PORT, USER, PASSWORD
                self.credentials[key] = value

    def load_extradata(self):
        self.credentials['GROUP'] = 1
        self.credentials['TOPIC'] = 'stocks/validation'

    def get_host(self):
        return self.credentials['HOST']

    def get_port(self):
        return int(self.credentials['PORT'])

    def get_user(self):
        return self.credentials['USER']

    def get_password(self):
        return self.credentials['PASSWORD']

    def get_group(self):
        return self.credentials['GROUP']

    def get_topic(self):
        return self.credentials['TOPIC']
