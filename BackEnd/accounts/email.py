from django.core.mail import send_mail
import random
from django.conf import settings
from django.http import HttpResponse, BadHeaderError, HttpResponseRedirect
from .models import User
import string


def get_random_string(length):
    letters = string.ascii_lowercase
    result_str = ''.join(random.choice(letters) for i in range(length))
    return result_str


def send_opt_via_email(email):
    subject = 'Your account verification email'
    otp = random.randint(100000, 999999)
    message = f"Your OTP is {otp}"
    email_from = settings.EMAIL_HOST
    send_mail(subject, message, email_from, [email])
    user_obj = User.objects.get(email=email)
    user_obj.otp = otp
    user_obj.save()


def send_reset_password(email):
    subject = "Your account needs to change its password"
    new_password = get_random_string(8)
    message = f"Your new password is: {new_password}"
    email_from = settings.EMAIL_HOST
    send_mail(subject, message, email_from, [email])
    user_obj = User.objects.get(email=email)
    user_obj.set_password(new_password)
    user_obj.save()

