# Generated by Django 4.2.2 on 2023-06-11 06:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0010_alter_jobrequirement_id'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={},
        ),
        migrations.AlterModelTable(
            name='extractcv',
            table='ExtractCV',
        ),
        migrations.AlterModelTable(
            name='jobrequirement',
            table='JobRequirement',
        ),
        migrations.AlterModelTable(
            name='user',
            table='User',
        ),
        migrations.CreateModel(
            name='Interview',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('hour_start', models.IntegerField()),
                ('minute_start', models.IntegerField()),
                ('hour_end', models.IntegerField()),
                ('minute_end', models.IntegerField()),
                ('date', models.DateField()),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('cancel', 'Canceled'), ('approval', 'Approved')], default='pending', max_length=20)),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.employee')),
                ('recruiter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.recruiter')),
            ],
            options={
                'db_table': 'Interview',
            },
        ),
    ]