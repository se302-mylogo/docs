# Generated by Django 3.1.3 on 2021-01-07 08:48

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cloudhomework', '0002_auto_20210105_0013'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='description',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.TextField(), default=list, size=None, verbose_name='课程简介'),
        ),
        migrations.AddField(
            model_name='course',
            name='references',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.TextField(), default=list, size=None, verbose_name='参考教材'),
        ),
    ]
