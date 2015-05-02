from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.db.models import F
from django.core.files import File
from django.core.serializers.json import DjangoJSONEncoder
from UploadImage.forms import UploadImageForm
from UploadImage.models import *
import json


def ImageUploadPage(request):
    """ Main index page render """
    return render_to_response('index.jade')


def SaveImage(request):
    """ Method to upload an image with its details """
    try:
        form = UploadImageForm(request.POST, request.FILES)
        if form.is_valid():
            new_image = form.cleaned_data
            print new_image
            up_file = request.FILES['image_file']
            destination = open('/tmp/' + up_file.name , 'wb+')
            for chunk in up_file.chunks():
                destination.write(chunk)
            destination.close()
            new_img = UploadImageClass(**{
              'title': request.POST['title'],
              'caption': request.POST['caption']
            })
            new_img.image_file.save(up_file.name, File(open('/tmp/' + up_file.name, 'r')))
            new_img.save()
            print new_img
            return HttpResponse(json.dumps({
                'status_code': 200,
                'status_msg': 'Success',
                'data': [] 
            }))
        return HttpResponse(json.dumps({
            'status_code': 300,
            'status_msg': 'Invalid Form',
            'data': form.__dict__
        }))
    except Exception, e:
        return HttpResponse(json.dumps({
            'status_code': 400,
            'status_msg': 'Error: ' + str(e)
        }))
    

def GetAllImages(request):
    """ Method to get image list sliced according to page number """
    search_str = request.GET['search_str'] if 'search_str' in request.GET else None
    curr_page = int(request.GET['cp']) if 'cp' in request.GET else 1
    page_limit = int(request.GET['plimit']) if 'plimit' in request.GET else 9
    filter_dict = {'is_deleted': False}
    if search_str:
        filter_dict.update({
            'title__icontains': search_str,
        })
    image_list = list(UploadImageClass.objects.filter(**filter_dict).\
                     values())[(curr_page - 1)*page_limit : curr_page*page_limit]
    return HttpResponse(json.dumps({
        'status_code': 200,
        'status_msg': 'Success',
        'data': image_list
    }, cls=DjangoJSONEncoder))
    

def LikeImage(request):
    """ Method to like an image """
    image_id = request.POST['image_id']
    try:
        UploadImageClass.objects.filter(id=image_id).update(like_count = F('like_count') + 1)
        return HttpResponse(json.dumps({
            'status_code': 200,
            'status_msg': 'Success'
        }))
    except Exception, e:
        return HttpResponse(json.dumps({
            'status_code': 400,
            'status_msg': 'Error: ' + str(e)
        })) 
  

def DeleteImage(request):
    """ Method to delete an image """
    image_id = request.POST['image_id']
    try:
        UploadImageClass.objects.filter(id=image_id).update(is_deleted=True)
        return HttpResponse(json.dumps({
            'status_code': 200,
            'status_msg': 'Success'
        }))
    except Exception, e:
        return HttpResponse(json.dumps({
            'status_code': 400,
            'status_msg': 'Error: ' + str(e)
        }))
