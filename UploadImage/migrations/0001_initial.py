# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UploadImageClass',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.TextField(null=True, blank=True)),
                ('image_file', models.ImageField(null=True, upload_to=b'static/uploads/img')),
                ('like_count', models.IntegerField(default=0)),
                ('share_count', models.IntegerField(default=0)),
                ('is_deleted', models.BooleanField(default=False)),
                ('uploaded_on', models.DateTimeField(auto_now=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
