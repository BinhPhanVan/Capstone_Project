# Generated by Django 4.2.2 on 2023-06-11 06:04

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0011_alter_user_options_alter_extractcv_table_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='interview',
            name='id',
            field=models.UUIDField(auto_created=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]