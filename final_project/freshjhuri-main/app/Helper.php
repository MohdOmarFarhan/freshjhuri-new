<?php

namespace App;

class Helper
{
    public const USER_STATUSES = [
        'Pending',
        'Approved',
        'Rejected',
    ];

    public const BLOOD_GROUPS = [
        'A+',
        'A-',
        'B+',
        'B-',
        'AB+',
        'AB-',
        'O+',
        'O-',
    ];

    public const RELIGIONS = [
        'Islam',
        'Hinduism',
        'Buddhism',
        'Christinty',
        'Others',
        'No Religion',
    ];

    public const GENDERS = [
        'Male',
        'Female',
        'Third Gender',
        'Others',
    ];

    public const NATIONALITIES = [
        'Bangladeshi',
        'Others',
    ];

    public const SUBTYPE_OPTIONS = [
        'Compulsory',
        'Main',
        'Optional',
        'MainCluster1',
        'MainCluster2',
        'MainCluster3',
        'OptionalCluster1',
        'OptionalCluster2',
        'OptionalCluster3',
        'Others',
    ];

    public const SUBTYPE_DEFAULT = 'Compulsory';

    public const PREVIOUS_RESULTS = [
        'A+',
        'A',
        'A-',
        'B',
        'B',
        'C',
        'D',
        'F',
    ];
}
