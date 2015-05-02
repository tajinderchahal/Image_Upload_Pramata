"""
Django settings for ProductERP project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/
SITE_URL = "http://localhost:8000"
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'sic97d8w(pj%#=*)tpvnqimq(v(lvwv#2n%0_4-q8lwfi*al@o'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []

TEMPLATE_DIRS = (
    BASE_DIR + '/UploadImage/templates/',
)

TEMPLATE_LOADERS = (
    ('pyjade.ext.django.Loader',(
         'django.template.loaders.filesystem.Loader',
         'django.template.loaders.app_directories.Loader',
    )),
)

#TEMPLATE_CONTEXT_PROCESSORS = (
#    'django.core.context_processors.request',
#    'django.contrib.auth.context_processors.auth'
#)

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'Auth',
    'UploadImage',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    #'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'urls'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases


DATABASES = {                                                                   
    'default': {                                                                
        'ENGINE': 'django.db.backends.postgresql_psycopg2',                     
        'NAME': 'pramata',                                                       
        'USER': 'pramata',                                                     
        'PASSWORD': 'pramata',                                                 
        'HOST': 'localhost',                                                    
        'PORT': '5432',                                                         
    },                                                                          
}

# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/
STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/
STATIC_ROOT = 'staticfiles'
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    #os.getcwd(),
    os.getcwd() + '/static/', # for localhost
)


FACEBOOK_APP_ID = '907433169279268'
FACEBOOK_APP_SECRET = '77bdd7a29298c932569ac6688bb5433b'
FACEBOOK_APP_SCOPE = 'email'
