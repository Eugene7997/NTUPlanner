from .models import Mods, Session, Exams, Venue
from rest_framework import serializers


class modsSerializers(serializers.ModelSerializer):
    """
    Serialises course queryset objects.
    """
    class Meta:
        model = Mods
        fields = ('courseCode', 'courseName')


class sessionSerializers(serializers.ModelSerializer):
    """
    Serialises session queryset objects.
    """
    lat = serializers.SerializerMethodField(read_only=True, allow_null=True)
    long = serializers.SerializerMethodField(read_only=True, allow_null=True)

    def get_lat(self, obj):
        """
        Retrieves the latitude information for a particular venue. \n
        :param obj: A session queryset. \n
        :return: None if the record does not exits, else it returns the latitude of the venue. \n
        """
        venueRecord = Venue.objects.filter(courseVenue=obj.courseVenue)
        if venueRecord:
            return venueRecord[0].latitude
        else:
            return None

    def get_long(self, obj):
        """
        Retrieves the longitude information for a particular venue. \n
        :param obj: A session queryset. \n
        :return: None if the record does not exits, else it returns the longitude of the venue.
        """
        venueRecord = Venue.objects.filter(courseVenue=obj.courseVenue)
        if venueRecord:
            return venueRecord[0].longitude
        else:
            return None

    class Meta:
        model = Session
        fields = ('courseIndex', 'lessonTime', 'lessonDay', 'courseType', 'courseGroup', 'courseVenue', 'lat', 'long', 'courseRemarks')


class examSerializer(serializers.ModelSerializer):
    """
    Serialises exam queryset objects.
    """
    class Meta:
        model = Exams
        fields = ('examDate', 'examTime', 'examDuration')

