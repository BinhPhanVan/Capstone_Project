

def check_pass(password):
    if len(password) < 8:
        return False
    return True


def same_pass(new_password, repeat_password):
    if new_password != repeat_password:
        return False
    return True
    