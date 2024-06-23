import { BaseEntity, BaseEntityProps } from '../Domain/Entity';
import { InMemoryRepository } from './InMemoryRepository';

class TestEntity extends BaseEntity<BaseEntityProps<string>, string> {
  constructor(id: string) {
    super({ id });
  }
}

describe('InMemoryRepository', () => {
  let repository: InMemoryRepository<TestEntity, string>;
  let entity: TestEntity;
  let entityId: string;

  beforeEach(() => {
    repository = new InMemoryRepository<TestEntity, string>();
    entityId = 'test-id';
    entity = new TestEntity(entityId);
  });

  describe('Happy Path', () => {
    it('should find an existing entity by ID', async () => {
      await repository.save(entity);
      const foundEntity = await repository.findById(entityId);
      expect(foundEntity).toEqual(entity);
    });

    it('should find all entities', async () => {
      await repository.save(entity);
      const allEntities = await repository.findAll();
      expect(allEntities).toEqual([entity]);
    });

    it('should check if an existing entity exists by ID', async () => {
      await repository.save(entity);
      const exists = await repository.exists(entityId);
      expect(exists).toBe(true);
    });

    it('should save a new entity', async () => {
      const savedEntity = await repository.save(entity);
      expect(savedEntity).toEqual(entity);
    });

    it('should delete an existing entity', async () => {
      await repository.save(entity);
      await repository.delete(entity);
      const exists = await repository.exists(entityId);
      expect(exists).toBe(false);
    });

    it('should delete an existing entity by ID', async () => {
      await repository.save(entity);
      await repository.deleteById(entityId);
      const exists = await repository.exists(entityId);
      expect(exists).toBe(false);
    });
  });

  describe('Edge Case', () => {
    it('should return null for findById with non-existent id', async () => {
      const foundEntity = await repository.findById('non-existent-id');
      expect(foundEntity).toBeNull();
    });

    it('should return the entity for findById with existing id', async () => {
      await repository.save(entity);
      const foundEntity = await repository.findById(entityId);
      expect(foundEntity).toEqual(entity);
    });

    it('should return an empty array for findAll when no entities are present', async () => {
      const allEntities = await repository.findAll();
      expect(allEntities).toEqual([]);
    });

    it('should return an array of entities for findAll when entities are present', async () => {
      await repository.save(entity);
      const allEntities = await repository.findAll();
      expect(allEntities).toEqual([entity]);
    });

    it('should return false for exists with non-existent id', async () => {
      const exists = await repository.exists('non-existent-id');
      expect(exists).toBe(false);
    });

    it('should return true for exists with existing id', async () => {
      await repository.save(entity);
      const exists = await repository.exists(entityId);
      expect(exists).toBe(true);
    });

    it('should add the entity to the repository when saved', async () => {
      await repository.save(entity);
      const exists = await repository.exists(entityId);
      expect(exists).toBe(true);
    });

    it('should return the saved entity when saved', async () => {
      const savedEntity = await repository.save(entity);
      expect(savedEntity).toEqual(entity);
    });

    it('should remove the entity from the repository when deleted', async () => {
      await repository.save(entity);
      await repository.delete(entity);
      const exists = await repository.exists(entityId);
      expect(exists).toBe(false);
    });

    it('should remove the entity with the given id from the repository when deleteById is called', async () => {
      await repository.save(entity);
      await repository.deleteById(entityId);
      const exists = await repository.exists(entityId);
      expect(exists).toBe(false);
    });

    it('should not remove any entity when deleteById is called with a non-existent id', async () => {
      await repository.save(entity);
      await repository.deleteById('non-existent-id');
      const exists = await repository.exists(entityId);
      expect(exists).toBe(true);
    });

    it('should not remove any entity when deleteById is called on an empty repository', async () => {
      await repository.deleteById('non-existent-id');
      const allEntities = await repository.findAll();
      expect(allEntities).toEqual([]);
    });
  });
});
