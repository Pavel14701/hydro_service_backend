export class Mapper {
  static toDomain<TDomain, TEntity>(
    entity: TEntity,
    DomainClass: { fromEntity(entity: TEntity): TDomain },
  ): TDomain {
    return DomainClass.fromEntity(entity);
  }

  static toDomainList<TDomain, TEntity>(
    entities: TEntity[],
    DomainClass: { fromEntity(entity: TEntity): TDomain },
  ): TDomain[] {
    return entities.map((entity) => DomainClass.fromEntity(entity));
  }
}
