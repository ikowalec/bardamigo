import './styles/bardamigo.scss';
import { BarDaMIgoActor } from './module/documents/actor';
import { BarDaMIgoItem } from './module/documents/item';
import { CharacterData } from './module/data-models/character-data';
import { NpcData } from './module/data-models/npc-data';
import { CardData } from './module/data-models/card-data';
import { BarDaMIgoActorSheet } from './module/sheets/actor-sheet';
import { BarDaMIgoNpcSheet } from './module/sheets/npc-sheet';
import { BarDaMIgoCardSheet } from './module/sheets/card-sheet';

/* -------------------------------------------- */
/*  Foundry VTT Initialization Hook             */
/* -------------------------------------------- */

Hooks.once('init', async () => {
  console.log('BarDaMIgo | Initializing BarDaMIgo Tabletop RPG System for Foundry VTT v14');

  // Register Document Classes
  CONFIG.Actor.documentClass = BarDaMIgoActor;
  CONFIG.Item.documentClass = BarDaMIgoItem;

  // Register TypeDataModels (v14 Native Standard)
  CONFIG.Actor.dataModels = {
    character: CharacterData,
    npc: NpcData
  };
  CONFIG.Item.dataModels = {
    card: CardData
  };

  // Configure Type Labels for Document Creation Dialogs
  CONFIG.Actor.typeLabels = {
    character: 'BARDAMIGO.Character',
    npc: 'BARDAMIGO.NPC'
  };
  CONFIG.Item.typeLabels = {
    card: 'BARDAMIGO.Card'
  };

  // Default Types for new documents
  (CONFIG.Actor as any).defaultType = 'character';
  (CONFIG.Item as any).defaultType = 'card';

  // Register ApplicationV2 Sheets
  Actors.registerSheet('bardamigo', BarDaMIgoActorSheet, {
    types: ['character'],
    makeDefault: true,
    label: 'BARDAMIGO.Character'
  });
  Actors.registerSheet('bardamigo', BarDaMIgoNpcSheet, {
    types: ['npc'],
    makeDefault: true,
    label: 'BARDAMIGO.NPC'
  });

  Items.registerSheet('bardamigo', BarDaMIgoCardSheet, {
    types: ['card'],
    makeDefault: true,
    label: 'BARDAMIGO.Card'
  });

  // Register Custom Handlebars Helpers
  Handlebars.registerHelper('isSlotFilled', function (items: any[], slot: string) {
    if (!items) return false;
    return items.some((i: any) => i.system?.slot === slot);
  });

  Handlebars.registerHelper('eq', function (a: any, b: any) {
    return a === b;
  });

  Handlebars.registerHelper('ne', function (a: any, b: any) {
    return a !== b;
  });

  // Preload templates
  await loadTemplates([
    'systems/bardamigo/templates/actor/actor-character.hbs',
    'systems/bardamigo/templates/actor/actor-npc.hbs',
    'systems/bardamigo/templates/item/item-card.hbs'
  ]);
});

Hooks.once('ready', async () => {
  console.log('BarDaMIgo | System ready for play.');
});
