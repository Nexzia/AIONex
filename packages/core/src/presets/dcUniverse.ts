import { Addon, Option, UserData } from '../db';
import { Preset, baseOptions } from './preset';
import { constants, Env } from '../utils';

export class DcUniversePreset extends Preset {
  // dc-batman-animations%2C
  // dc-superman-animations%2C
  // dc-batman%2C
  // dc-superman
  private static catalogs = [
    {
      label: 'DC Chronological Order',
      value: 'dc-chronological',
    },
    {
      label: 'DC Release Order',
      value: 'dc-release',
    },
    {
      label: 'Movies',
      value: 'dc-movies',
    },
    {
      label: 'DCEU Movies',
      value: 'dceu_movies',
    },
    {
      label: 'Series',
      value: 'dc-series',
    },
    {
      label: 'DC Modern Series',
      value: 'dc_modern_series',
    },
    {
      label: 'Animations',
      value: 'dc-animations',
    },
    {
      label: 'Batman Animations',
      value: 'dc-batman-animations',
    },
    {
      label: 'Superman Animations',
      value: 'dc-superman-animations',
    },
    {
      label: 'Batman Collection',
      value: 'dc-batman',
    },
    {
      label: 'Superman Collection',
      value: 'dc-superman',
    },
  ];
  static override get METADATA() {
    const supportedResources = [
      constants.CATALOG_RESOURCE,
      constants.META_RESOURCE,
    ];

    const options: Option[] = [
      ...baseOptions(
        'DC Universe',
        supportedResources,
        Env.DEFAULT_DC_UNIVERSE_TIMEOUT
      ).filter((option) => option.id !== 'url'),
      // series movies animations xmen release-order marvel-mcu
      {
        id: 'catalogs',
        name: 'Catalogs',
        description: 'The catalogs to display',
        type: 'multi-select',
        required: true,
        options: this.catalogs,
        default: this.catalogs.map((catalog) => catalog.value),
      },
    ];

    return {
      ID: 'dc-universe',
      NAME: 'DC Universe',
      LOGO: 'https://raw.githubusercontent.com/tapframe/addon-dc/refs/heads/main/assets/icon.png',
      URL: Env.DC_UNIVERSE_URL,
      TIMEOUT: Env.DEFAULT_DC_UNIVERSE_TIMEOUT || Env.DEFAULT_TIMEOUT,
      USER_AGENT: Env.DEFAULT_DC_UNIVERSE_USER_AGENT || Env.DEFAULT_USER_AGENT,
      SUPPORTED_SERVICES: [],
      DESCRIPTION:
        'Explore the DC Universe by release date, movies, series, and animations!',
      OPTIONS: options,
      SUPPORTED_STREAM_TYPES: [],
      SUPPORTED_RESOURCES: supportedResources,
    };
  }

  static async generateAddons(
    userData: UserData,
    options: Record<string, any>
  ): Promise<Addon[]> {
    return [this.generateAddon(userData, options)];
  }

  private static generateAddon(
    userData: UserData,
    options: Record<string, any>
  ): Addon {
    const config =
      options.catalogs.length !== this.catalogs.length
        ? options.catalogs.join('%2C')
        : '';
    return {
      name: options.name || this.METADATA.NAME,
      identifyingName: options.name || this.METADATA.NAME,
      manifestUrl: `${Env.DC_UNIVERSE_URL}/${config ? 'catalog/' + config + '/' : ''}manifest.json`,
      enabled: true,
      library: false,
      resources: options.resources || this.METADATA.SUPPORTED_RESOURCES,
      timeout: options.timeout || this.METADATA.TIMEOUT,
      presetType: this.METADATA.ID,
      presetInstanceId: '',
      headers: {
        'User-Agent': this.METADATA.USER_AGENT,
      },
    };
  }
}
