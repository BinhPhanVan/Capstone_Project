from django.core.mail import send_mail
import random
from django.conf import settings
from django.http import HttpResponse, BadHeaderError, HttpResponseRedirect
from .models import User
from django.template.loader import get_template
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

def send_email_with_template(email):
    email_from = settings.EMAIL_HOST
    subject = 'Your account verification email'
    otp = random.randint(100000, 999999)
    try:
        template = get_template('emails/verify_otp.html')
        context = {'otp': otp}
        message = template.render(context)
        send_mail(subject, '', email_from, [email], html_message=message)
        user_obj = User.objects.get(email=email)
        user_obj.otp = otp
        user_obj.save()
    except Exception as e:
        print(e)

def send_email_with_job(email, name_candidate, job_name, pdf_upload , company_name, name, email_user):
    email_from = settings.EMAIL_HOST
    subject = 'Invitation for Job'
    try:
        template = get_template('emails/send_job.html')
        context = {
            'job_name': job_name,
            'name_candidate': name_candidate,
            'company_name': company_name,
            'pdf_upload': pdf_upload,
            'name': name,
            'email_user': email_user
        }
        message = template.render(context)
        send_mail(subject, '', email_from, [email], html_message=message)
    except Exception as e:
        print(e)

def send_email_with_cv(email, job_name, company_name, pdf_file, name, email_user ):
    email_from = settings.EMAIL_HOST
    subject = 'Job Application'
    try:
        template = get_template('emails/send_cv.html')
        context = {
            'job_name': job_name,
            'company_name': company_name,
            'pdf_file': pdf_file,
            'name': name,
            'email': email_user,
        }
        message = template.render(context)
        send_mail(subject, '', email_from, [email], html_message=message)
    except Exception as e:
        print(e)

def send_email_with_interview(email, company_name, date, time):
    email_from = settings.EMAIL_HOST
    subject = 'Job Interview'
    try:
        template = get_template('emails/send_interview.html')
        context = {
            'company_name': company_name,
            'interview_date': date,
            'interview_time': time,
        }
        message = template.render(context)
        send_mail(subject, '', email_from, [email], html_message=message)
    except Exception as e:
        print(e)


def send_reset_password(email):
    subject = "Your account needs to change its password"
    new_password = get_random_string(8)
    message = f"Your new password is: {new_password}"
    email_from = settings.EMAIL_HOST
    send_mail(subject, message, email_from, [email])
    user_obj = User.objects.get(email=email)
    user_obj.set_password(new_password)
    user_obj.save()

