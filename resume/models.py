from django.db import models
from wagtail.wagtailcore import blocks
from wagtail.wagtailcore.fields import StreamField
from wagtail.wagtailcore.models import Page
from wagtail.wagtailadmin.edit_handlers import StreamFieldPanel


class HeaderBlock(blocks.TextBlock):
    class Meta:
        template = 'resume/blocks/header_block.html'
        icon = 'title'


class SubHeaderBlock(blocks.StructBlock):
    text = blocks.TextBlock(label='Title')
    sub_title = blocks.TextBlock(label='Sub-title')
    meta = blocks.TextBlock()

    class Meta:
        template = 'resume/blocks/sub_header_block.html'
        icon = 'title'
        label = 'Sub-header'


class ResumePage(Page):
    body = StreamField([
        ('rich_text', blocks.RichTextBlock()),
        ('html', blocks.RawHTMLBlock()),
        ('header', HeaderBlock()),
        ('sub_header', SubHeaderBlock()),
    ])

    content_panels = Page.content_panels + [
        StreamFieldPanel('body'),
    ]
