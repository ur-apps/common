import { ValidationError } from 'class-validator';

import { Errors } from 'interfaces';

const errors1: ValidationError[] = [
  {
    target: {
      profileId: 'invalid_uuid',
      dictionaryId: 'de46f9cf-7216-455a-854a-1a005794e4f8',
      items: [
        {
          id: '8206beed-fc9b-4566-bb72-47e737e10ef7',
          word: 'home',
          pos: 'nouns',
          dialect: 'us',
        },
      ],
    },
    value: '7aab4883-d8dc-4ec2-9d8c-31b9c87c96fc2132312131',
    property: 'profileId',
    children: [],
    constraints: {
      isUuid: 'profileId must be a UUID',
    },
  },
  {
    target: {
      profileId: 'invalid_uuid',
      dictionaryId: 'de46f9cf-7216-455a-854a-1a005794e4f8',
      items: [
        {
          id: '8206beed-fc9b-4566-bb72-47e737e10ef7',
          word: 'home',
          pos: 'nouns',
          dialect: 'us',
        },
      ],
    },
    property: 'word',
    children: [],
    constraints: {
      isNotEmpty: 'word should not be empty',
    },
  },
  {
    target: {
      profileId: 'invalid_uuid',
      dictionaryId: 'de46f9cf-7216-455a-854a-1a005794e4f8',
      items: [
        {
          id: '8206beed-fc9b-4566-bb72-47e737e10ef7',
          word: 'home',
          pos: 'nouns',
          dialect: 'us',
        },
      ],
    },
    value: [
      {
        id: '8206beed-fc9b-4566-bb72-47e737e10ef7',
        word: 'home',
        pos: 'nouns',
        dialect: 'us',
      },
      {
        id: '644579b1-aab6-4515-b856-d941fe69a296',
        word: 'home',
        pos: 'adjective',
        dialect: 'us',
      },
      {
        id: 'a24e77e6-9c29-41ca-a738-892844a4434f',
        word: 'home',
        pos: 'verb',
        dialect: 'us',
      },
      {
        id: 'cadfb3ed-39aa-481c-8057-313764e0ea7c',
        word: 'home',
        pos: 'adverb',
        dialect: 'us',
      },
    ],
    property: 'items',
    children: [
      {
        target: [
          {
            id: '8206beed-fc9b-4566-bb72-47e737e10ef7',
            word: 'home',
            pos: 'nouns',
            dialect: 'us',
          },
          {
            id: '644579b1-aab6-4515-b856-d941fe69a296',
            word: 'home',
            pos: 'adjective',
            dialect: 'us',
          },
          {
            id: 'a24e77e6-9c29-41ca-a738-892844a4434f',
            word: 'home',
            pos: 'verb',
            dialect: 'us',
          },
          {
            id: 'cadfb3ed-39aa-481c-8057-313764e0ea7c',
            word: 'home',
            pos: 'adverb',
            dialect: 'us',
          },
        ],
        value: {
          id: '8206beed-fc9b-4566-bb72-47e737e10ef7',
          word: 'home',
          pos: 'nouns',
          dialect: 'us',
        },
        property: '0',
        children: [
          {
            target: {
              id: '8206beed-fc9b-4566-bb72-47e737e10ef7',
              word: 'home',
              pos: 'nouns',
              dialect: 'us',
            },
            value: 'nouns',
            property: 'pos',
            children: [],
            constraints: {
              isEnum: 'pos must be a valid enum value',
            },
          },
        ],
      },
    ],
  },
];

const errors2: ValidationError[] = [
  {
    target: {
      favChild: {},
      children: [
        {
          favPet: {
            name: 123,
          },
        },
        {
          pets: [{}],
        },
      ],
    },
    property: 'name',
    children: [],
    constraints: {
      isNotEmpty: 'name should not be empty',
      isString: 'name must be a string',
    },
  },
  {
    target: {
      favChild: {},
      children: [
        {
          favPet: {
            name: 123,
          },
        },
        {
          pets: [{}],
        },
      ],
    },
    property: 'age',
    children: [],
    constraints: {
      min: 'age must not be less than 0',
      isInt: 'age must be an integer number',
    },
  },
  {
    target: {
      favChild: {},
      children: [
        {
          favPet: {
            name: 123,
          },
        },
        {
          pets: [{}],
        },
      ],
    },
    value: [
      {
        favPet: {
          name: 123,
        },
      },
      {
        pets: [{}],
      },
    ],
    property: 'children',
    children: [
      {
        target: [
          {
            favPet: {
              name: 123,
            },
          },
          {
            pets: [{}],
          },
        ],
        value: {
          favPet: {
            name: 123,
          },
        },
        property: '0',
        children: [
          {
            target: {
              favPet: {
                name: 123,
              },
            },
            property: 'name',
            children: [],
            constraints: {
              isNotEmpty: 'name should not be empty',
              isString: 'name must be a string',
            },
          },
          {
            target: {
              favPet: {
                name: 123,
              },
            },
            property: 'age',
            children: [],
            constraints: {
              min: 'age must not be less than 0',
              isInt: 'age must be an integer number',
            },
          },
          {
            target: {
              favPet: {
                name: 123,
              },
            },
            property: 'isSmart',
            children: [],
            constraints: {
              isBoolean: 'isSmart must be a boolean value',
            },
          },
          {
            target: {
              favPet: {
                name: 123,
              },
            },
            property: 'pets',
            children: [],
            constraints: {
              isArray: 'pets must be an array',
            },
          },
          {
            target: {
              favPet: {
                name: 123,
              },
            },
            value: {
              name: 123,
            },
            property: 'favPet',
            children: [
              {
                target: {
                  name: 123,
                },
                value: 123,
                property: 'name',
                children: [],
                constraints: {
                  isString: 'name must be a string',
                },
              },
            ],
          },
        ],
      },
      {
        target: [
          {
            favPet: {
              name: 123,
            },
          },
          {
            pets: [{}],
          },
        ],
        value: {
          pets: [{}],
        },
        property: '1',
        children: [
          {
            target: {
              pets: [{}],
            },
            property: 'name',
            children: [],
            constraints: {
              isNotEmpty: 'name should not be empty',
              isString: 'name must be a string',
            },
          },
          {
            target: {
              pets: [{}],
            },
            property: 'age',
            children: [],
            constraints: {
              min: 'age must not be less than 0',
              isInt: 'age must be an integer number',
            },
          },
          {
            target: {
              pets: [{}],
            },
            property: 'isSmart',
            children: [],
            constraints: {
              isBoolean: 'isSmart must be a boolean value',
            },
          },
          {
            target: {
              pets: [{}],
            },
            value: [{}],
            property: 'pets',
            children: [
              {
                target: [{}],
                value: {},
                property: '0',
                children: [
                  {
                    target: {},
                    property: 'name',
                    children: [],
                    constraints: {
                      isNotEmpty: 'name should not be empty',
                      isString: 'name must be a string',
                    },
                  },
                ],
              },
            ],
          },
          {
            target: {
              pets: [{}],
            },
            property: 'favPet',
            children: [],
            constraints: {
              isObject: 'favPet must be an object',
            },
          },
        ],
      },
    ],
  },
  {
    target: {
      favChild: {},
      children: [
        {
          favPet: {
            name: 123,
          },
        },
        {
          pets: [{}],
        },
      ],
    },
    value: {},
    property: 'favChild',
    children: [
      {
        target: {},
        property: 'name',
        children: [],
        constraints: {
          isNotEmpty: 'name should not be empty',
          isString: 'name must be a string',
        },
      },
      {
        target: {},
        property: 'age',
        children: [],
        constraints: {
          min: 'age must not be less than 0',
          isInt: 'age must be an integer number',
        },
      },
      {
        target: {},
        property: 'isSmart',
        children: [],
        constraints: {
          isBoolean: 'isSmart must be a boolean value',
        },
      },
      {
        target: {},
        property: 'pets',
        children: [],
        constraints: {
          isArray: 'pets must be an array',
        },
      },
      {
        target: {},
        property: 'favPet',
        children: [],
        constraints: {
          isObject: 'favPet must be an object',
        },
      },
    ],
  },
];

export const classValidatorErrors: Record<string, ValidationError[]> = {
  1: errors1,
  2: errors2,
};

export const mappedErrors: Record<string, Errors> = {
  '1': {
    profileId: 'profileId must be a UUID',
    word: 'word should not be empty',
    items: { 0: { pos: 'pos must be a valid enum value' } },
  },
  '2': {
    name: ['name should not be empty', 'name must be a string'],
    age: ['age must not be less than 0', 'age must be an integer number'],
    children: {
      0: {
        name: ['name should not be empty', 'name must be a string'],
        age: ['age must not be less than 0', 'age must be an integer number'],
        isSmart: 'isSmart must be a boolean value',
        pets: 'pets must be an array',
        favPet: {
          name: 'name must be a string',
        },
      },
      1: {
        name: ['name should not be empty', 'name must be a string'],
        age: ['age must not be less than 0', 'age must be an integer number'],
        isSmart: 'isSmart must be a boolean value',
        pets: {
          0: {
            name: ['name should not be empty', 'name must be a string'],
          },
        },
        favPet: 'favPet must be an object',
      },
    },
    favChild: {
      name: ['name should not be empty', 'name must be a string'],
      age: ['age must not be less than 0', 'age must be an integer number'],
      isSmart: 'isSmart must be a boolean value',
      pets: 'pets must be an array',
      favPet: 'favPet must be an object',
    },
  },
};
