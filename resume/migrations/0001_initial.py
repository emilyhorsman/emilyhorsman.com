# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-01-01 17:09
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import resume.models
import wagtail.wagtailcore.blocks
import wagtail.wagtailcore.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('wagtailcore', '0040_page_draft_title'),
    ]

    operations = [
        migrations.CreateModel(
            name='ResumePage',
            fields=[
                ('page_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='wagtailcore.Page')),
                ('body', wagtail.wagtailcore.fields.StreamField((('rich_text', wagtail.wagtailcore.blocks.RichTextBlock()), ('html', wagtail.wagtailcore.blocks.RawHTMLBlock()), ('header', resume.models.HeaderBlock()), ('sub_header', wagtail.wagtailcore.blocks.StructBlock((('title', wagtail.wagtailcore.blocks.TextBlock()), ('sub_title', wagtail.wagtailcore.blocks.TextBlock()), ('meta', wagtail.wagtailcore.blocks.TextBlock()))))))),
            ],
            options={
                'abstract': False,
            },
            bases=('wagtailcore.page',),
        ),
    ]
