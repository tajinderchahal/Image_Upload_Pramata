from django.db import models
import datetime

# Create your models here.

class UploadImageClass(models.Model):
    title = models.TextField(null=True, blank=True)
    #caption = models.TextField(null=True, blank=True)
    image_file = models.ImageField(upload_to ='static/uploads/img', null= True)
    like_count = models.IntegerField(default=0)
    share_count = models.IntegerField(default=0)
    is_deleted = models.BooleanField(default=False)
    uploaded_on = models.DateTimeField(auto_now=True)
