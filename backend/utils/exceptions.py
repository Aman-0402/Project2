import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        logger.exception(
            "Unhandled exception in %s",
            context.get('view', 'unknown view'),
            exc_info=exc,
        )
        return Response(
            {
                'success': False,
                'message': 'An unexpected error occurred.',
                'data': None,
                'errors': None,
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return response
