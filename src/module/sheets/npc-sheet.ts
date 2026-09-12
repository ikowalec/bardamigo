import { BarDaMIgoActor } from '../documents/actor';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

/**
 * NPC / Enemy Sheet Application (ApplicationV2) for BarDaMIgo.
 */
export class BarDaMIgoNpcSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static override DEFAULT_OPTIONS = {
    classes: ['bardamigo', 'sheet', 'actor', 'npc-sheet'],
    tag: 'form',
    position: {
      width: 540,
      height: 600
    },
    actions: {
      rollMorale: BarDaMIgoNpcSheet.#onRollMorale,
      rollDefense: BarDaMIgoNpcSheet.#onRollDefense
    },
    form: {
      submitOnChange: true,
      closeOnSubmit: false
    }
  };

  static override PARTS = {
    form: {
      template: 'systems/bardamigo/templates/actor/actor-npc.hbs'
    }
  };

  override async _prepareContext(options: any) {
    const actor = this.actor as BarDaMIgoActor;
    const system = actor.system as any;

    return {
      actor,
      system,
      isOwner: actor.isOwner,
      editable: this.isEditable
    };
  }

  static async #onRollMorale(this: BarDaMIgoNpcSheet, event: PointerEvent) {
    event.preventDefault();
    const will = (this.actor.system as any).will || 0;
    const roll = new Roll('1d20 + @will', { will });
    await roll.evaluate();

    const targetDC = 14;
    const isSuccess = roll.total >= targetDC;
    const flavor = `${this.actor.name} - ${game.i18n.localize('BARDAMIGO.NPC.Morale')} (vs DC ${targetDC})`;
    const statusText = isSuccess
      ? game.i18n.localize('BARDAMIGO.Roll.Success')
      : `${game.i18n.localize('BARDAMIGO.Roll.Failure')} (${game.i18n.localize('BARDAMIGO.NPC.MoraleDesc')})`;

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor,
      content: `
        <div class="bardamigo-chat-card">
          <div class="card-header"><strong>${flavor}</strong></div>
          <div class="dice-roll">
            <h4 class="dice-total ${isSuccess ? 'success' : 'failure'}">${roll.total}</h4>
            <div class="roll-eval ${isSuccess ? 'success' : 'failure'}">${statusText}</div>
          </div>
        </div>
      `
    });
  }

  static async #onRollDefense(this: BarDaMIgoNpcSheet, event: PointerEvent) {
    event.preventDefault();
    const die = (this.actor.system as any).defenseDie;
    if (die && die !== 'none') {
      (this.actor as BarDaMIgoActor).rollDefense(die, 'Armor / Barrier');
    }
  }
}
