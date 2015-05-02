from django.conf.urls import patterns, include, url
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^auth/', include('Auth.urls')),
    url(r'^$', 'UploadImage.views.ImageUploadPage'),
    url(r'^upload$', 'UploadImage.views.SaveImage'),
    url(r'^get$', 'UploadImage.views.GetAllImages'),
    url(r'^like$', 'UploadImage.views.LikeImage'),
    url(r'^delete$', 'UploadImage.views.DeleteImage'),
)
