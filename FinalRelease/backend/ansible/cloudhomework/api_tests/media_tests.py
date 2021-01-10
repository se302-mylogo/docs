from django.conf import settings
from rest_framework import status

from cloudhomework.api_tests.base import BaseAPITest


class MediaTests(BaseAPITest):
    media_out_schema = ['id', 'createAt', 'updateAt', 'filename', 'token', 'size', 'mime']

    def test_upload_media_success(self):
        test_file = open(f'{settings.MEDIA_ROOT}/tests/test_file.txt')
        upload_res = self.client.post('/medias', {
            'upfile': test_file
        }, format='multipart')
        self.assertEqual(upload_res.status_code, status.HTTP_201_CREATED)
        media_data = upload_res.json()
        self.assertSchema(media_data, self.media_out_schema)
        self.assertEqual(test_file.name.split('/')[-1], media_data['filename'])

    def test_upload_mime(self):
        test_file = open(f'{settings.MEDIA_ROOT}/tests/apple.png', 'rb')
        upload_res = self.client.post('/medias', {
            'upfile': test_file
        }, format='multipart')
        self.assertEqual(upload_res.status_code, status.HTTP_201_CREATED)
        media_data = upload_res.json()
        self.assertSchema(media_data, self.media_out_schema)
        self.assertEqual(test_file.name.split('/')[-1], media_data['filename'])
        self.assertEqual(media_data['mime'], 'image/png')

    def test_access_media(self):
        test_media = self.test_media1
        access_res = self.client.get(f'/medias/{test_media.token}')
        self.assertEqual(access_res.status_code, status.HTTP_200_OK)
        self.assertTrue('Content-Type' in access_res)
        self.assertEqual(access_res['Content-Type'], 'text/plain')

    def test_access_media_in_id_notallowd(self):
        test_media = self.test_media1
        access_res = self.client.get(f'/medias/{test_media.id}')
        self.assertEqual(access_res.status_code, status.HTTP_404_NOT_FOUND)

    def test_download_media(self):
        test_media = self.test_media2
        access_res = self.client.get(f'/medias/{test_media.token}/download')
        self.assertEqual(access_res.status_code, status.HTTP_200_OK)
        self.assertTrue('Content-Type' in access_res)
        self.assertEqual(access_res['Content-Type'], 'text/plain')
        self.assertTrue('Content-Disposition' in access_res)
        self.assertEqual(access_res['Content-Disposition'], f'attachment; filename={test_media.filename}')
