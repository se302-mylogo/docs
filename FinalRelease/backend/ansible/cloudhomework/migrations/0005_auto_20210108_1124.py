# Generated by Django 3.1.3 on 2021-01-08 03:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cloudhomework', '0004_homework_answer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.PROTECT, to='cloudhomework.media', verbose_name='头像'),
        ),
    ]
