import { BarDaMIgoActor } from '../documents/actor';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

/**
 * Character Sheet Application (ApplicationV2) for BarDaMIgo.
 */
export class BarDaMIgoActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static override DEFAULT_OPTIONS = {
    classes: ['bardamigo', 'sheet', 'actor', 'character-sheet'],
    tag: 'form',
    position: {
      width: 720,
      height: 840
    },
    actions: {
      rollAttribute: BarDaMIgoActorSheet.#onRollAttribute,
      rollDefense: BarDaMIgoActorSheet.#onRollDefense,
      shortRest: BarDaMIgoActorSheet.#onShortRest,
      longRest: BarDaMIgoActorSheet.#onLongRest,
      createCard: BarDaMIgoActorSheet.#onCreateCard,
      editCard: BarDaMIgoActorSheet.#onEditCard,
      deleteCard: BarDaMIgoActorSheet.#onDeleteCard
    },
    form: {
      submitOnChange: true,
      closeOnSubmit: false
    }
  };

  static override PARTS = {
    form: {
      template: 'systems/bardamigo/templates/actor/actor-character.hbs'
    }
  };

  override async _prepareContext(options: any) {
    const actor = this.actor as BarDaMIgoActor;
    const system = actor.system as any;

    // Categorize items
    const cards = actor.items.contents;
    const activeCards = cards.filter(c => (c.system as any).slot !== 'backpack');
    const backpackCards = cards.filter(c => (c.system as any).slot === 'backpack');
    const defenseItems = cards.filter(c => (c.system as any).defenseDie && (c.system as any).defenseDie !== 'none');

    // Generate hit boxes array for rendering (1 to 8)
    const hitBoxes = [];
    for (let i = 1; i <= 8; i++) {
      hitBoxes.push({
        number: i,
        isFilled: i <= system.combat.hits,
        isWithinLimit: i <= system.hitLimit
      });
    }

    return {
      actor,
      system,
      activeCards,
      backpackCards,
      defenseItems,
      hitBoxes,
      isOwner: actor.isOwner,
      editable: this.isEditable
    };
  }

  /* -------------------------------------------- */
  /*  Action Handlers                             */
  /* -------------------------------------------- */

  static async #onRollAttribute(this: BarDaMIgoActorSheet, event: PointerEvent, target: HTMLElement) {
    event.preventDefault();
    const attrKey = target.dataset.attribute as 'sila' | 'zrecznosc' | 'umysl' | 'wola';
    if (!attrKey) return;

    // Prompt for roll type & target DC dialog
    new Dialog({
      title: game.i18n.format('BARDAMIGO.Roll.Check', {
        attribute: game.i18n.localize(`BARDAMIGO.Attributes.${attrKey.charAt(0).toUpperCase() + attrKey.slice(1)}`)
      }),
      content: `
        <div style="margin-bottom: 10px;">
          <label style="display:block; margin-bottom: 5px; font-weight: bold;">${game.i18n.localize('BARDAMIGO.Roll.RollType')}:</label>
          <select id="roll-mode" style="width: 100%;">
            <option value="normal">${game.i18n.localize('BARDAMIGO.Roll.Normal')}</option>
            <option value="advantage">${game.i18n.localize('BARDAMIGO.Roll.Advantage')}</option>
            <option value="disadvantage">${game.i18n.localize('BARDAMIGO.Roll.Disadvantage')}</option>
          </select>
        </div>
        <div>
          <label style="display:block; margin-bottom: 5px; font-weight: bold;">${game.i18n.localize('BARDAMIGO.Roll.Difficulty')}:</label>
          <select id="target-dc" style="width: 100%;">
            <option value="">-- None / Opposed --</option>
            <option value="10">${game.i18n.localize('BARDAMIGO.Roll.Easy')}</option>
            <option value="14" selected>${game.i18n.localize('BARDAMIGO.Roll.Moderate')}</option>
            <option value="18">${game.i18n.localize('BARDAMIGO.Roll.Hard')}</option>
            <option value="22">${game.i18n.localize('BARDAMIGO.Roll.Heroic')}</option>
          </select>
        </div>
      `,
      buttons: {
        roll: {
          icon: '<i class="fas fa-dice-d20"></i>',
          label: 'Roll',
          callback: (html: JQuery) => {
            const mode = html.find('#roll-mode').val() as 'normal' | 'advantage' | 'disadvantage';
            const dcStr = html.find('#target-dc').val() as string;
            const dc = dcStr ? parseInt(dcStr, 10) : undefined;
            (this.actor as BarDaMIgoActor).rollAttribute(attrKey, mode, dc);
          }
        }
      },
      default: 'roll'
    }).render(true);
  }

  static async #onRollDefense(this: BarDaMIgoActorSheet, event: PointerEvent, target: HTMLElement) {
    event.preventDefault();
    const die = target.dataset.die || 'd6';
    const source = target.dataset.source || 'Defense';
    (this.actor as BarDaMIgoActor).rollDefense(die, source);
  }

  static async #onShortRest(this: BarDaMIgoActorSheet, event: PointerEvent) {
    event.preventDefault();
    Dialog.confirm({
      title: game.i18n.localize('BARDAMIGO.Rest.ShortRest'),
      content: `<p>${game.i18n.localize('BARDAMIGO.Rest.ShortRestPrompt')}</p>`,
      yes: () => (this.actor as BarDaMIgoActor).shortRest()
    });
  }

  static async #onLongRest(this: BarDaMIgoActorSheet, event: PointerEvent) {
    event.preventDefault();
    Dialog.confirm({
      title: game.i18n.localize('BARDAMIGO.Rest.LongRest'),
      content: `<p>${game.i18n.localize('BARDAMIGO.Rest.LongRestPrompt')}</p>`,
      yes: () => (this.actor as BarDaMIgoActor).longRest()
    });
  }

  static async #onCreateCard(this: BarDaMIgoActorSheet, event: PointerEvent, target: HTMLElement) {
    event.preventDefault();
    const slot = target.dataset.slot || 'any';
    await Item.create(
      {
        name: game.i18n.localize('BARDAMIGO.Cards.Add'),
        type: 'card',
        system: { slot, cardType: slot === 'weapon' ? 'weapon' : slot === 'protection' ? 'protection' : 'gear' }
      },
      { parent: this.actor }
    );
  }

  static async #onEditCard(this: BarDaMIgoActorSheet, event: PointerEvent, target: HTMLElement) {
    event.preventDefault();
    const cardId = target.dataset.cardId || target.closest('[data-card-id]')?.getAttribute('data-card-id');
    const card = this.actor.items.get(cardId as string);
    card?.sheet?.render(true);
  }

  static async #onDeleteCard(this: BarDaMIgoActorSheet, event: PointerEvent, target: HTMLElement) {
    event.preventDefault();
    const cardId = target.dataset.cardId || target.closest('[data-card-id]')?.getAttribute('data-card-id');
    const card = this.actor.items.get(cardId as string);
    card?.delete();
  }
}
