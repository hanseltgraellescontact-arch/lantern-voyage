/* The Home Waters: seven islands for the prelude (BJU Math 2, 5th ed., chapters 14–20, lessons 126–180). */
var CONTENT = window.CONTENT || {};
CONTENT.islands = CONTENT.islands || {};
CONTENT.seas = [{
  id: 'home', name: 'The Home Waters',
  islands: [
    { id: 'P14', name: 'Slice Isle', kind: 'bakery', x: 230, y: 470, unit: 'Fractions (BJU Math 2, ch. 14)' },
    { id: 'P15', name: 'Kite Cove', kind: 'kite', x: 470, y: 560, unit: 'Geometry (ch. 15)' },
    { id: 'P16', name: 'Weather Rock', kind: 'weather', x: 700, y: 470, unit: 'Metric measurement (ch. 16)' },
    { id: 'P17', name: 'Thousand Dunes', kind: 'dunes', x: 960, y: 520, unit: '4-digit numbers (ch. 17)' },
    { id: 'P18', name: 'Sharing Shore', kind: 'share', x: 1000, y: 300, unit: 'Introduction to division (ch. 18)' },
    { id: 'P19', name: 'Basket Bay', kind: 'basket', x: 740, y: 230, unit: 'Division facts (ch. 19)' },
    { id: 'P20', name: 'Compass Key', kind: 'compass', x: 470, y: 260, unit: 'Coding (ch. 20)' }
  ]
}];

CONTENT.intro = [
  { say: 'Long ago, the Bright Isles were full of light. Every island had a lighthouse to guide ships safely home.', art: 'lit' },
  { say: 'But one night a thick, gray fog rolled in. One by one, the lighthouses went dark, and the ships could not find their way.', art: 'fog' },
  { say: 'Now a brave young captain is setting sail to relight every lighthouse. That captain is you!', art: 'ship' },
  { say: 'Every island has a keeper who needs your help. Learn their math, solve their problems, and the light will shine again.', art: 'keeper' }
];
