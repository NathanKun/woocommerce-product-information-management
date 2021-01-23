import {CategoryAttribute, PimLocale, ProductAttribute} from "../interface/Settings";
import {Category} from "../interface/Category";
import {Product} from "../interface/Product";

export class Tool {
  static timeConversion(millisec: number) {
    const seconds = Number((millisec / 1000).toFixed(1));
    const minutes = Number((millisec / (1000 * 60)).toFixed(1));
    const hours = Number((millisec / (1000 * 60 * 60)).toFixed(1));
    const days = Number((millisec / (1000 * 60 * 60 * 24)).toFixed(1));

    if (seconds < 60) {
      return seconds + ' Sec';
    } else if (minutes < 60) {
      return minutes + ' Min';
    } else if (hours < 24) {
      return hours + ' Hrs';
    } else {
      return days + ' Days';
    }
  }

  static humanFileSize(bytes: number, si = false, dp = 1): string {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }

    const units = si
      ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
      bytes /= thresh;
      ++u;
    } while (
      Math.round(Math.abs(bytes) * r) / r >= thresh &&
      u < units.length - 1
      );

    return bytes.toFixed(dp) + ' ' + units[u];
  }

  static prepareAttrArrays(attributes: ProductAttribute[] | CategoryAttribute[], pimLocales: PimLocale[]): ProductAttribute[] | CategoryAttribute[] {
    const allLocalizedAttr: ProductAttribute[] | CategoryAttribute[] = []

    for (let attr of attributes) {
      if (attr.localizable) {
        for (let locale of pimLocales) {
          const attrName = attr.name + "#" + locale.countryCode
          allLocalizedAttr.push({
            name: attrName,
            description: attr.description,
            valueType: attr.valueType,
            localizable: attr.localizable,
            id: attr.id,
            variation: attr['variation'],
          })
        }
      } else {
        allLocalizedAttr.push({
          name: attr.name,
          description: attr.description,
          valueType: attr.valueType,
          localizable: attr.localizable,
          id: attr.id,
          variation: attr['variation'],
        })
      }
    }

    return allLocalizedAttr
  }

  static processItemFillAttributes(it: Product | Category, allLocalizedAttr: ProductAttribute[] | CategoryAttribute[]) {
    // add any attr which not exists in this pdt
    for (let attr of allLocalizedAttr) {
      if (it.attributes.find(it => it.name === attr.name) === undefined) {
        it.attributes.push({
          name: attr.name,
          value: "",
          type: attr.valueType
        })
      }
    }

    // remove any attr not configured
    it.attributes = it.attributes.filter(attrObj => {
      return allLocalizedAttr.find(attrDef => attrDef.name === attrObj.name) !== undefined
    })
  }
}
