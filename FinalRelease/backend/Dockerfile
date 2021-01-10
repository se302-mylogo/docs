FROM python:3.8
ARG HOME=/home/cloudhomework
COPY cloudhomework/ ${HOME}/cloudhomework
COPY cloudhomework_backend/ ${HOME}/cloudhomework_backend
COPY manage.py requirements.txt uwsgi.ini ${HOME}/
WORKDIR /home/cloudhomework
RUN pip install -r requirements.txt
ENV DJANGO_SETTINGS_MODULE=cloudhomework_backend.settings
CMD uwsgi --ini uwsgi.ini