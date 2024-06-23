import { InvalidTypesError, RequiredPropsError } from './MessageErrors';
import {
  EMessageStatus,
  Message,
  TMessageMetadata,
  TMessagePayload,
  TMessageProps,
} from './Messages';

class TestMessage extends Message {}

describe('Message Class', () => {
  const validProps: TMessageProps = {
    id: '123',
    type: 'TEST',
    status: EMessageStatus.CREATED,
    payload: { data: 'payloadData' },
    metadata: { info: 'metadataInfo' },
    timestamp: Date.now(),
  };

  describe('Happy Path', () => {
    it('should return correct values for all getters', () => {
      const message = new TestMessage(validProps);

      expect(message.id).toBe(validProps.id);
      expect(message.type).toBe(validProps.type);
      expect(message.status).toBe(validProps.status);
      expect(message.payload).toEqual(validProps.payload);
      expect(message.metadata).toEqual(validProps.metadata);
      expect(message.timestamp).toBe(validProps.timestamp);
    });

    it('should freeze props object', () => {
      const message = new TestMessage(validProps);

      const props = (message as unknown as { props: TMessageProps }).props;
      expect(Object.isFrozen(props)).toBe(true);
    });

    it('should not allow modification of props', () => {
      const message = new TestMessage(validProps);

      const modifyProps = () => {
        const props = (message as unknown as { props: TMessageProps }).props;
        (props as { id: string }).id = '456';
      };

      expect(modifyProps).toThrow(TypeError);
    });

    it('should return correct value for payload getter', () => {
      const message = new TestMessage(validProps);

      expect(message.payload).toEqual(validProps.payload);
    });

    it('should return correct value for metadata getter', () => {
      const message = new TestMessage(validProps);

      expect(message.metadata).toEqual(validProps.metadata);
    });

    it('should return correct value for timestamp getter', () => {
      const message = new TestMessage(validProps);

      expect(message.timestamp).toBe(validProps.timestamp);
    });
  });

  describe('Edge Cases', () => {
    it('should throw RequiredPropsError when required properties are missing', () => {
      expect(() => {
        new TestMessage({ ...validProps, id: undefined } as TMessageProps);
      }).toThrow(RequiredPropsError);

      expect(() => {
        new TestMessage({ ...validProps, type: undefined } as TMessageProps);
      }).toThrow(RequiredPropsError);

      expect(() => {
        new TestMessage({ ...validProps, timestamp: undefined } as TMessageProps);
      }).toThrow(RequiredPropsError);
    });

    it('should throw InvalidTypesError for invalid types', () => {
      expect(() => {
        new TestMessage({ ...validProps, id: 123 as unknown as string });
      }).toThrow(InvalidTypesError);

      expect(() => {
        new TestMessage({ ...validProps, type: 123 as unknown as string });
      }).toThrow(InvalidTypesError);

      expect(() => {
        new TestMessage({ ...validProps, timestamp: '123' as unknown as number });
      }).toThrow(InvalidTypesError);

      expect(() => {
        new TestMessage({ ...validProps, status: 'INVALID_STATUS' as unknown as EMessageStatus });
      }).toThrow(InvalidTypesError);
    });

    it('should throw InvalidTypesError for invalid payload type', () => {
      expect(() => {
        new TestMessage({
          ...validProps,
          payload: 'invalid_payload' as unknown as TMessagePayload,
        });
      }).toThrow(InvalidTypesError);
    });

    it('should throw InvalidTypesError for invalid metadata type', () => {
      expect(() => {
        new TestMessage({
          ...validProps,
          metadata: 'invalid_metadata' as unknown as TMessageMetadata,
        });
      }).toThrow(InvalidTypesError);
    });
  });
});
