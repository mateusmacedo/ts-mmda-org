import { BaseEntity, BaseEntityProps, Repository, RepositoryError } from '../Domain';

export class InMemoryRepository<T extends BaseEntity<BaseEntityProps<ID>, ID>, ID>
  implements Repository<T, ID>
{
  private entities: Map<string, T> = new Map();

  async findById(id: ID): Promise<T | null> {
    return this.entities.get(id.toString()) || null;
  }

  async findAll(): Promise<T[]> {
    return Array.from(this.entities.values());
  }

  async exists(id: ID): Promise<boolean> {
    return this.entities.has(id.toString());
  }

  async save(entity: T): Promise<T> {
    if (this.entities.has(entity.getId().toString())) {
      throw new RepositoryError(`Entity with ID ${entity.getId().toString()} already exists.`);
    }
    this.entities.set(entity.getId().toString(), entity);
    return entity;
  }

  async delete(entity: T): Promise<void> {
    if (!this.entities.has(entity.getId().toString())) {
      throw new RepositoryError(`Entity with ID ${entity.getId().toString()} not found.`);
    }
    this.entities.delete(entity.getId().toString());
  }

  async deleteById(id: ID): Promise<void> {
    if (!this.entities.has(id.toString())) {
      throw new RepositoryError(`Entity with ID ${id.toString()} not found.`);
    }
    this.entities.delete(id.toString());
  }
}
