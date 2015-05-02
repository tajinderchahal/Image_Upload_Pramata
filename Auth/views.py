import oauth2 as oauth
from django.contrib.auth import authenticate, logout, login
from django.shortcuts import render, redirect, render_to_response
from Auth.models import UserProfile
from django.http import HttpResponseRedirect
import json
import urllib
import cgi
import settings
import datetime


def logout_req(request):
    logout(request)
    return redirect('/')

"""
Method for Login through Facebook
"""
def facebook_login(request):
    params = {
        'scope': settings.FACEBOOK_APP_SCOPE,
        'client_id': settings.FACEBOOK_APP_ID,
        'redirect_uri': settings.SITE_URL + '/auth/facebook/callback'
    }
    url = "https://graph.facebook.com/oauth/authorize?" + urllib.urlencode(params)
    return HttpResponseRedirect(url)


"""
Facebook social auth callback method
"""
def facebook_login_callback(request):
    params = {
        'client_id': settings.FACEBOOK_APP_ID,
        'client_secret': settings.FACEBOOK_APP_SECRET,
        'redirect_uri': settings.SITE_URL + '/auth/facebook/callback',
        'code': request.GET['code'] if 'code' in request.GET else ''
    }
    if not params['code']:
        return redirect('/')

    response = cgi.parse_qs(urllib.urlopen( "https://graph.facebook.com/oauth/access_token?" +\
                             urllib.urlencode(params)).read()) 
    access_token = response["access_token"][-1]
    user_profile = json.load(urllib.urlopen("https://graph.facebook.com/me?" + \
                        urllib.urlencode(dict(access_token=access_token))))
    if not 'email' in user_profile.keys():
        return redirect('/')
    custom_profile = {
        'first_name': user_profile['first_name'],
        'last_name': user_profile['last_name'],
        'username': user_profile['email'],
        'email': user_profile['email'],
        'profile_image': "https://graph.facebook.com/"+ user_profile['id'] +"/picture?width=100&height=100",
        'source': 'facebook',
        'fb_user_id': user_profile['id']
    }
    result = create_user_from_social_auth(request, custom_profile)
    return redirect('/')


"""
Method for creating User in UserProfile 
"""
def create_user_from_social_auth(request, user_profile):
    user = UserProfile.objects.filter(email = user_profile['email'])
    if len(user):
        print 'User found in db: ', user_profile
        user = user[0]
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        user.save()
        login(request, user) 
        return 1
    try:
        print 'Creating New User: ', user_profile
        user = UserProfile(**user_profile)
        user.save()
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)
        return 1
    except Exception, e:
        print 'Error while creating user: ', str(e)
        return 0


def login_fake(request):
    from django.contrib.auth.models import *
    u = User.objects.all()[0]
    u.backend = 'django.contrib.auth.backends.ModelBackend'
    login(request, u)
    return HttpResponseRedirect('/photographer/signup/')
