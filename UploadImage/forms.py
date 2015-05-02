from django import forms
from UploadImage.models import UploadImageClass 

class UploadImageForm(forms.Form):
    title = forms.CharField(max_length=100)
    #caption = forms.CharField(max_length=1000)
    image_file = forms.ImageField()

    class Meta:
        model = UploadImageClass
