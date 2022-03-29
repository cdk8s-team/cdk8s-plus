import { IResource } from './base';
import { ApiResource } from './api-resource.generated';

/**
 * The part of a rule that corresponds to a set of resources.
 */
export interface IRuleResources {
  readonly apiGroups: Array<string>;
  readonly resourceTypes?: Array<string>;
  readonly resourceNames?: Array<string>;
}

/**
 * Represents a collection of resources.
 */
export class Resources {
  /**
   * Collect a set of resource objects into a collection that a Role or
   * ClusterRole can grant permissions to.
   */
  public static fromObjects(...objects: IResource[]): Resources {
    const apiGroups: string[] = normalizedArray(objects
      .map((obj) => obj.apiGroup)
      .map((apiGroup) => apiGroup === 'core' ? '' : apiGroup),
    );
    const resourceNames: string[] = normalizedArray(objects.map((obj) => obj.name));
    return new Resources({ apiGroups, resourceNames });
  }

  /**
   * Combine multiple resource types into a collection that a Role or
   * ClusterRole can grant permissions to.
   */
  public static fromTypes(...types: ApiResource[]): Resources {
    const apiGroups = normalizedArray(types
      .map(type => type.apiGroups)
      .flat(),
    );
    const resourceTypes = normalizedArray(types
      .map(type => type.resources)
      .filter((x): x is string[] => Boolean(x))
      .flat(),
    );
    return new Resources({ apiGroups, resourceTypes });
  }

  private constructor(public readonly value: IRuleResources) {}
}

function normalizedArray<T>(xs: T[]): T[] {
  return Array.from(new Set(xs)).sort();
}
