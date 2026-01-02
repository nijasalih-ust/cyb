from django.contrib import admin
from django.apps import apps

# Get all models from your 'api' app
app_config = apps.get_app_config('api')
models = app_config.get_models()

for model in models:
    try:
        admin.site.register(model)
    except admin.sites.AlreadyRegistered:
        # This prevents an error if you manually registered a model earlier
        pass