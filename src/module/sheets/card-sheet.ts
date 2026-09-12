import { BarDaMIgoItem } from '../documents/item';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

/**
 * Card / Item Sheet Application (ApplicationV2) for BarDaMIgo.
 */
export class BarDaMIgoCardSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static override DEFAULT_OPTIONS = {
    classes: ['bardamigo', 'sheet', 'item', 'card-sheet'],
    tag: 'form',
    position: {
      width: 500,
      height: 520
    },
    form: {
      submitOnChange: true,
      closeOnSubmit: false
    }
  };

  static override PARTS = {
    form: {
      template: 'systems/bardamigo/templates/item/item-card.hbs'
    }
  };

  override async _prepareContext(options: any) {
    const item = this.item as BarDaMIgoItem;
    const system = item.system as any;

    return {
      item,
      system,
      isOwner: item.isOwner,
      editable: this.isEditable,
      cardTypes: {
        weapon: 'BARDAMIGO.Cards.TypeWeapon',
        protection: 'BARDAMIGO.Cards.TypeProtection',
        spell: 'BARDAMIGO.Cards.TypeSpell',
        gear: 'BARDAMIGO.Cards.TypeGear',
        ability: 'BARDAMIGO.Cards.TypeAbility',
        relic: 'BARDAMIGO.Cards.TypeRelic'
      },
      slots: {
        weapon: 'BARDAMIGO.Cards.SlotWeapon',
        protection: 'BARDAMIGO.Cards.SlotProtection',
        any: 'BARDAMIGO.Cards.SlotAny',
        development: 'BARDAMIGO.Cards.SlotDevelopment',
        backpack: 'BARDAMIGO.Cards.SlotBackpack'
      },
      defenseDice: {
        none: 'None',
        d4: 'k4 / d4',
        d6: 'k6 / d6',
        d8: 'k8 / d8',
        d10: 'k10 / d10',
        d12: 'k12 / d12'
      },
      attributes: {
        none: 'None',
        sila: 'BARDAMIGO.Attributes.Strength',
        zrecznosc: 'BARDAMIGO.Attributes.Agility',
        umysl: 'BARDAMIGO.Attributes.Mind',
        wola: 'BARDAMIGO.Attributes.Will'
      }
    };
  }
}
