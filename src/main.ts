import Phaser from 'phaser';
import './styles/index.css';
import { phaserConfig } from './game/config/phaserConfig';
import { initializeFirebaseRuntime } from './firebase/firebaseApp';

initializeFirebaseRuntime();

const game = new Phaser.Game(phaserConfig);

window.addEventListener('beforeunload', () => {
  game.events.emit('cardville:before-unload');
});
