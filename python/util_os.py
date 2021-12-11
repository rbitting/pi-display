import os

def get_absolute_path(file_path):
    return os.path.join(os.path.dirname(os.path.dirname(os.path.realpath(__file__))), file_path)
    
def path_exists(file_path):
    return os.path.exists(file_path)

def get_env_var(var):
    return os.environ.get(var)