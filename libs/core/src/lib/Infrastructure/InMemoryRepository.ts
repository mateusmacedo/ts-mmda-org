import { BaseEntity, BaseEntityProps, Repository } from '../Domain';

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
    this.entities.set(entity.getId().toString(), entity);
    return entity;
  }

  async delete(entity: T): Promise<void> {
    this.entities.delete(entity.getId().toString());
  }

  async deleteById(id: ID): Promise<void> {
    this.entities.delete(id.toString());
  }
}
