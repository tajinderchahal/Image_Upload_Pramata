from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class UserProfile(User):
    profile_image = models.TextField(default="/static/image/default_dp.png")
    source = models.CharField(max_length=20)
    fb_user_id = models.CharField(max_length=100, null=True, blank=True)
    
