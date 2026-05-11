import type { ShapeType } from './types';

export interface LoreSection {
  heading: string;
  body: string;
}

export const SHAPE_LORE: Record<ShapeType, { epigraph?: string; sections: LoreSection[] }> = {
  flowerOfLife: {
    epigraph: 'The blueprint of all forms.',
    sections: [
      {
        heading: 'Origin',
        body:
          "The Flower of Life is among the oldest documented geometric figures in human culture. Its earliest surviving etching is on a granite column at the Osireion in Abydos, Egypt, where the pattern appears to have been laser-burned into the stone — its dating is uncertain but conservatively predates 2000 BCE. Identical figures recur at the Forbidden City in Beijing, at the Temple of Osiris in India, in synagogues in the Galilee, in Norman cloisters, in Tibetan monasteries, and across Phoenician, Assyrian and Roman ruins. Leonardo da Vinci studied it in his notebooks, deriving from it the Platonic solids and the Vitruvian proportions of the human body.",
      },
      {
        heading: 'Geometry',
        body:
          'Nineteen complete circles of equal radius are arranged on a hexagonal close-packing lattice. Each non-edge circle is tangent to six others; their intersections form vesica piscis nodes. Drawing every centre and every intersection generates the Seed, Egg, Fruit and Tree of Life patterns, the five Platonic solids, the 64-tetrahedron grid, and the golden ratio. Mathematically it expresses the densest possible packing of 2D circles, a structural truth that recurs in honeycombs, raft cell division and Wigner-Seitz lattices.',
      },
      {
        heading: 'Symbolism',
        body:
          'In western esotericism the figure represents the unified field — every form, frequency and being arising from a single point of creation. In Kabbalah it is read as the radiant matrix from which the Tree of Life is derived. In Hindu, Buddhist and Sufi traditions it is read as the cosmic womb, the principle that "all is one and one is all". Drunvalo Melchizedek\'s modern teachings popularised the pattern as a memory key for the human energy field, in which the same hexagonal architecture is said to organise the aura.',
      },
      {
        heading: 'In nature',
        body:
          'The hexagonal phyllotaxis of sunflowers, snowflakes, beehive comb, basalt columns, dragonfly wings, and the molecular lattices of graphene and quartz all share the same packing logic. The motif is read by many scholars as humanity\'s oldest record of nature\'s minimum-energy preference for hexagonal symmetry.',
      },
    ],
  },

  seedOfLife: {
    epigraph: 'The seven days of creation.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The Seed of Life is the central construction step of the Flower of Life — six circles of equal radius arrayed hexagonally around a seventh central circle. It is the geometry that emerges naturally when, beginning with one circle, you draw a second circle whose centre lies on the first, then continue extending circles through each new intersection. Six steps later the pattern closes.',
      },
      {
        heading: 'Symbolism',
        body:
          'In Genesis the world is created in seven days; in the Seed each of the six outer circles is read as a day of creation around the central seventh day of rest. It is one of the most universally adopted glyphs of creation: it appears in Catholic stained glass, Cabalistic diagrams, Sufi mandalas, Wiccan altars and Buddhist mandalas. The Star of David, the rose of the cathedral window, and the petals of the Sri Yantra all derive their proportions from this figure.',
      },
      {
        heading: 'Geometry',
        body:
          'Seven circles, six intersection points on the inner ring forming a regular hexagon. The figure tiles the plane perfectly in hexagonal close packing and demonstrates that six is the maximum number of equal-radius circles that can touch a central circle of the same radius — a result foundational to both crystallography and quantum-field theory.',
      },
    ],
  },

  eggOfLife: {
    epigraph: 'The geometry of the second cell division.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The Egg of Life is the three-dimensional volumetric extension of the Seed of Life: eight spheres of equal radius arranged so that six form a hexagonal ring with one above and one below, exactly mirroring the third division of every fertilised egg in nature. Every multicellular organism — from elephant to redwood — passes through this configuration at the 8-cell blastocyst stage, before differentiating.',
      },
      {
        heading: 'Geometry',
        body:
          'The eight centres define the vertices of a stretched octahedron sitting at the centre of the cuboctahedral close-packing lattice. Connecting opposing vertices yields four perpendicular axes of symmetry, the mathematical basis of biological chirality.',
      },
      {
        heading: 'Symbolism',
        body:
          'Esoterically the Egg is read as the moment when polarity emerges from unity: the eighth note in the diatonic scale, the eighth day of resurrection, the octave of consciousness, the metaphysical pre-form of every living body. In Drunvalo Melchizedek\'s teachings this is the form of the embryonic human merkaba.',
      },
    ],
  },

  fruitOfLife: {
    epigraph: 'Thirteen circles, the blueprint of the cube.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The Fruit of Life is the pattern obtained by selecting only the thirteen non-overlapping circles inside an extended Flower of Life — one central circle, six in an inner hexagon, and six in an outer hexagram. It is the immediate progenitor of Metatron\'s Cube and was taught in mystery schools as the figure from which the five Platonic solids are derived by connecting every centre to every other centre.',
      },
      {
        heading: 'Symbolism',
        body:
          'Thirteen is a sacred number in many traditions: the thirteen lunar months, the twelve apostles plus Christ, the thirteen Mayan baktuns, the thirteen treasures of Buddha. The Fruit is read as the perfected, fertilised form of creation — what blossoms from the Seed and the Flower.',
      },
      {
        heading: 'Geometry',
        body:
          'The thirteen centres fit on two concentric circles around the origin, at distances 2r and 2r√3, with the outer hexagon rotated 30° relative to the inner. Drawing every pair of centres yields exactly 78 chords, and within them the orthogonal projections of all five Platonic solids appear simultaneously — the geometric proof that all volumetric form is implicit in this single figure.',
      },
    ],
  },

  metatronsCube: {
    epigraph: 'The blueprint guarded by the highest archangel.',
    sections: [
      {
        heading: 'Origin',
        body:
          'Metatron\'s Cube is named after the archangel Metatron, the "voice of God" who, in Jewish mystical tradition, holds the seventy-eight chords connecting the thirteen circles of the Fruit of Life. Its first known depictions appear in the Sefer Yetzirah and in medieval Kabbalistic diagrams; thirteenth-century Gothic cathedrals encoded the figure into rose windows from Chartres to Notre-Dame.',
      },
      {
        heading: 'Geometry',
        body:
          'Thirteen equal spheres connected by every possible straight line yield 78 distinct line segments. Within those segments the orthogonal projections of all five Platonic solids — tetrahedron, cube, octahedron, dodecahedron, icosahedron — appear simultaneously, along with the cuboctahedron and the star tetrahedron. It is the only known 2D figure that contains projections of every regular convex polytope.',
      },
      {
        heading: 'Symbolism',
        body:
          'The Cube is the angelic guardian of the records of creation. Metatron is described in the Zohar as the scribe who records every soul; the geometry is read as the alphabet from which all form is written. It is invoked in protection rituals across Western Hermeticism: contemplating the Cube is said to attune the mind to the underlying lawful order of the cosmos.',
      },
    ],
  },

  merkaba: {
    epigraph: 'The chariot of light.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The word merkaba (מֶרְכָּבָה) appears 44 times in the Hebrew Bible, derived from the root for "to ride". Ezekiel\'s vision of the throne-chariot of God — wheels within wheels, four-faced angels rotating without turning — became the foundational mystical text of Jewish Merkavah-Heikhalot traditions, the ascent literature in which adepts visualised themselves climbing through seven palaces of light to behold the divine throne.',
      },
      {
        heading: 'Geometry',
        body:
          'Two interlocked tetrahedra — one apex up, one apex down — form a star tetrahedron, also called the stella octangula, first formally described by Pacioli (1509) and Kepler (1611). The figure has eight vertices coincident with the vertices of a cube, twelve edges of common length, and constitutes the densest interpenetration of two regular three-simplexes.',
      },
      {
        heading: 'Symbolism',
        body:
          'In modern esoteric teaching the merkaba is the vehicle of light surrounding the body, the masculine tetrahedron pointing upward and the feminine pointing downward; spinning in counter-rotation they generate a torsion field said to allow inter-dimensional ascension. The two interpenetrating tetrahedra also encode the union of fire and water, spirit and matter, heaven and earth — the alchemical "as above, so below" rendered in three dimensions.',
      },
    ],
  },

  vesicaPiscis: {
    epigraph: 'The womb of all geometry.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The Vesica Piscis ("bladder of the fish") is the almond-shaped overlap of two circles of equal radius whose centres each lie on the other\'s circumference. It is the first construction in Euclid\'s Elements, Proposition 1, used to bisect a line and construct an equilateral triangle. The figure was a sacred symbol in early Pythagorean schools and across Mediterranean mystery traditions.',
      },
      {
        heading: 'Symbolism',
        body:
          'Early Christians used the vesica as the ichthys, the secret sign of the fish, painted on doorways to mark gathering houses. In Marian iconography it became the mandorla — the body-of-glory aura surrounding Christ and the Virgin in Byzantine and Romanesque frescos. To the Templars and the Gnostics it represented the divine feminine, the gate between worlds. Geometrically it generates the equilateral triangle, the regular hexagon, the square root of three, and the foundation of Gothic cathedral architecture.',
      },
      {
        heading: 'Geometry',
        body:
          'The ratio between its long and short axes is exactly √3:1. Its area is 2(π/3 − √3/4) r² ≈ 1.228 r². It is the seed cell of the entire Flower of Life lattice — every other circle in the Flower derives from successive vesicas.',
      },
    ],
  },

  sriYantra: {
    epigraph: 'The cosmic womb of the goddess.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The Sri Yantra (श्री यन्त्र, "instrument of splendour") is the central diagram of the Shri Vidya tradition of Tantric Hinduism, encoding the body of the supreme goddess Lalitā Tripurasundarī. References to the figure appear in the Rudrayāmala Tantra (likely 8th century CE) and the figure has been continuously worshipped at Sringeri in Karnataka. Adi Shankaracharya\'s Saundarya Lahari sings of it as the geometric anatomy of Devi.',
      },
      {
        heading: 'Geometry',
        body:
          'Nine interpenetrating triangles surround a central bindu point. Four upward-pointing triangles (Shiva) interlock with five downward-pointing triangles (Shakti) to generate 43 smaller triangles. Outside the triangles are circles, two lotus rings of eight and sixteen petals, and three protective gateways. Constructing the figure precisely is so difficult that mathematicians have published numerical analyses showing the classical proportions cannot be solved by ruler-and-compass alone — only by iterative refinement.',
      },
      {
        heading: 'Symbolism',
        body:
          'Each region of the Yantra corresponds to a step on the path from the gross sense-world (outer petals) through the subtle (interior triangles) to the causal point of pure consciousness (the bindu). Meditation moves inward through the chakras, dissolving multiplicity until only the source remains.',
      },
    ],
  },

  treeOfLife: {
    epigraph: 'Ten sephirot, twenty-two paths.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The Tree of Life (Etz Chayim, עץ החיים) is the central diagram of Kabbalah, the Jewish mystical tradition codified in the Sefer Yetzirah (~3rd century CE) and the Zohar (13th century, attributed to Moses de León). It encodes the structure by which Ein Sof — the boundless source — emanates the manifest universe through ten progressive contractions called sephirot.',
      },
      {
        heading: 'Geometry',
        body:
          'Ten nodes (sephirot) are arranged on three vertical pillars — Mercy, Severity, and Equilibrium. The nodes are linked by twenty-two paths corresponding to the twenty-two letters of the Hebrew alphabet, and these paths are also the twenty-two arcana of the Tarot in Hermetic Qabalah. The pattern is implicit in the Flower of Life — every node and edge can be derived from intersections of the Flower\'s circles.',
      },
      {
        heading: 'The ten sephirot',
        body:
          'Keter (Crown), Chokhmah (Wisdom), Binah (Understanding); Chesed (Mercy), Gevurah (Severity), Tiferet (Beauty); Netzach (Eternity), Hod (Splendour), Yesod (Foundation); Malkuth (Kingdom). Each sephira is a name of God, a face of consciousness, an angelic order, a body-part, a planet, a virtue and a vice. Walking the Tree is the central practice of Hermetic initiation, mapped in the Golden Dawn system, the Lurianic Kabbalah, and modern transpersonal psychology.',
      },
    ],
  },

  tetrahedron: {
    epigraph: 'Element of fire — the simplest possible volume.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The tetrahedron is the simplest of the five Platonic solids and the first to appear in human record — neolithic clay tetrahedra have been found at Skara Brae and across central Europe dating to ~3000 BCE. Plato in the Timaeus (~360 BCE) assigned it to the element of fire on the grounds that it has the sharpest points and the smallest volume relative to surface area, exactly the qualities of flame.',
      },
      {
        heading: 'Geometry',
        body:
          'Four equilateral-triangle faces, four vertices, six edges. It is the only Platonic solid that is its own dual: the centroids of its faces form another tetrahedron. Eight tetrahedra and six octahedra together tile space in the perfect lattice that lies at the heart of crystallography and is the symmetry of carbon, water and the diamond cubic.',
      },
      {
        heading: 'Symbolism',
        body:
          'Pythagoreans called it the seed of all polyhedra. In modern energetics it is invoked as the geometry of stable, projective intent — the apex pointed up directs creative will, pointed down receives. Buckminster Fuller called the tetrahedron the "minimum thinkable system" — the smallest object that divides space into an inside and an outside.',
      },
    ],
  },

  cube: {
    epigraph: 'Element of earth — the geometry of solidity.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The hexahedron, more commonly the cube, was assigned by Plato to the element of earth in the Timaeus on the grounds that it is the most stable, the only Platonic solid that tiles space alone, and the one with square faces — the most "stuck" in place. Cubes appear in Sumerian, Egyptian and Mesoamerican architecture as the foundation stone of temples; the Ka\'aba in Mecca is a cubic shrine; the Holy of Holies in Solomon\'s temple was a perfect cube of 20 cubits.',
      },
      {
        heading: 'Geometry',
        body:
          'Six square faces, eight vertices, twelve edges. It is the dual of the octahedron — the centroids of a cube\'s faces form a regular octahedron and vice versa. The cube is the only regular polyhedron that tiles three-dimensional Euclidean space without gaps.',
      },
      {
        heading: 'Symbolism',
        body:
          'The cube is associated with the material plane, the body, structure, foundation and law. Saturn in classical astrology, Malkuth in Kabbalah, the throne of God in Ezekiel, the New Jerusalem of Revelation (a cube 12,000 stadia per side). It teaches the discipline of form — the soul descending into matter and learning to express itself through limit.',
      },
    ],
  },

  octahedron: {
    epigraph: 'Element of air — the balance of polarities.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The octahedron was Plato\'s element of air: light, mobile, balanced. It is the natural crystal form of diamond, fluorite, magnetite and alum, found in ancient Egyptian, Indian and Mesopotamian gemstone caches. Pythagorean and Vitruvian commentaries treat it as the figure that holds opposites in dynamic equilibrium.',
      },
      {
        heading: 'Geometry',
        body:
          'Eight equilateral-triangle faces, six vertices, twelve edges. It is the dual of the cube: place a vertex at the centre of each face of a cube and you get an octahedron, and vice versa. Two opposite tetrahedra share an octahedron at their intersection; the octahedron tiles space in equal proportion with the tetrahedron.',
      },
      {
        heading: 'Symbolism',
        body:
          'The form is read as the heart chakra in classical chakra-yoga — the meeting point of the three lower (matter) and three upper (spirit) energy centres. Its six vertices are the six cardinal directions and the six cardinal virtues. To gaze on an octahedron is to contemplate balance: nothing in it can fall.',
      },
    ],
  },

  dodecahedron: {
    epigraph: 'Element of aether — the geometry of the cosmos.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The dodecahedron was the fifth Platonic solid, reserved by Plato in the Timaeus for "the figure of the universe" — the substance the Greeks called aether or quintessence. Roman dodecahedra of bronze, often hollow with pentagonal holes, are found across northern Europe, function still debated. The cosmologist Jean-Pierre Luminet has argued that observations of the cosmic microwave background fit a dodecahedral closed-universe topology.',
      },
      {
        heading: 'Geometry',
        body:
          'Twelve regular pentagonal faces, twenty vertices, thirty edges. Every face is at the golden ratio in relation to its inscribed pentagram. The dodecahedron is the dual of the icosahedron and pairs of dodecahedra and icosahedra together generate the icosahedral symmetry group H₃, the highest symmetry group of any non-spherical solid.',
      },
      {
        heading: 'Symbolism',
        body:
          'Twelve is the number of the zodiac, the months, the apostles, the gates of the New Jerusalem, the cranial nerves. The figure embodies the principle that the cosmos is one organism with twelve faces of expression. To meditate on it is to contemplate the order that holds the heavens together.',
      },
    ],
  },

  icosahedron: {
    epigraph: 'Element of water — the geometry of flow.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The icosahedron was assigned by Plato to water on the grounds that its many small triangular faces and roundness of profile let it "roll" most easily — exactly the property of water. It appears in iron-pyrite crystals, in capsid shells of viruses (from the common cold to HIV), and in the geodesic shells of buckminsterfullerenes (C₆₀).',
      },
      {
        heading: 'Geometry',
        body:
          'Twenty equilateral-triangle faces, twelve vertices, thirty edges. Its twelve vertices coincide with three mutually perpendicular golden rectangles, the simplest manifestation of φ in three dimensions. It is the dual of the dodecahedron — together they generate the H₃ icosahedral symmetry group.',
      },
      {
        heading: 'Symbolism',
        body:
          'In modern energetics the icosahedron is associated with feminine flow, intuition, and the unconscious. Bucky Fuller built the geodesic dome from a subdivided icosahedron, demonstrating that this geometry can enclose more volume per surface area than any other polyhedron — a built proof of the alchemical wisdom that water finds its level.',
      },
    ],
  },

  sphere: {
    epigraph: 'The unity, the All.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The sphere is the perfect form — every point on its surface equidistant from the centre, no edges, no faces, no preferred direction. Parmenides, Pythagoras and Plato treat the sphere as the figure of the One. Astronomers from Eratosthenes onward have understood the Earth as spherical; modern physics treats every fundamental field as spherically symmetric around a source.',
      },
      {
        heading: 'Geometry',
        body:
          'A sphere of radius r has surface area 4πr² and volume (4/3)πr³ — both involving π, irrational, transcendental, and undefinable except through infinite series. The sphere has the maximum volume-to-surface-area ratio of any closed surface; soap bubbles, planets and water droplets all find this form because it minimises energy.',
      },
      {
        heading: 'Symbolism',
        body:
          'Across every wisdom tradition the sphere is the figure of wholeness, completeness, the soul, the cosmos and God. "God is a circle whose centre is everywhere and whose circumference is nowhere" — attributed to Hermes Trismegistus, Empedocles, Nicholas of Cusa, Pascal and Borges. It is the form to which all spiritual practice tends.',
      },
    ],
  },

  torus: {
    epigraph: 'The field of energetic flow.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The torus — a donut-shaped surface of revolution — has been studied since antiquity. The mathematician Hero of Alexandria (1st c. CE) gave the formula for its volume. In modern physics it is the natural shape of magnetic confinement fields (tokamaks), of plasma flows, and according to many cosmologists the connectivity of the universe itself.',
      },
      {
        heading: 'Geometry',
        body:
          'A torus is generated by revolving a circle of radius r around a coplanar axis at distance R from its centre. Surface area = 4π²Rr; volume = 2π²Rr². Topologically the torus has genus 1 — a single hole — distinguishing it from the simply-connected sphere. The flat torus is the only closed 2-manifold that admits a flat Euclidean metric, making it the simplest non-trivial geometry of cosmology.',
      },
      {
        heading: 'Symbolism',
        body:
          'In modern energetics the torus is the shape of every self-sustaining field: the heart\'s electromagnetic envelope, the Earth\'s magnetosphere, the atom\'s electron shells. Energy flows out at one pole, around the surface, and back in through the other — the geometric form of breath, circulation, and regenerative life.',
      },
    ],
  },

  torusKnot: {
    epigraph: 'Woven flow lines on the torus surface.',
    sections: [
      {
        heading: 'Origin',
        body:
          'A (p, q)-torus knot is a closed curve that winds p times around one axis of a torus and q times around the other, where p and q are coprime. The simplest non-trivial torus knot is the trefoil (p=2, q=3), depicted on Celtic stonework from at least the 7th century CE and in Buddhist endless-knot iconography.',
      },
      {
        heading: 'Geometry',
        body:
          'The set of all torus knots is in bijection with coprime integer pairs (p, q). Each is chiral — left- and right-handed forms are not equivalent. Torus knots are the simplest non-trivial knots in three-dimensional space and form the seed of modern knot theory and quantum topology.',
      },
      {
        heading: 'Symbolism',
        body:
          'The endless knot is one of the eight auspicious symbols of Tibetan Buddhism, representing the inseparability of compassion and wisdom, of cause and effect — a single line woven without beginning or end. It teaches the contemplative that all phenomena are mutually interdependent.',
      },
    ],
  },

  fibonacci: {
    epigraph: 'The golden spiral, the breath of growth.',
    sections: [
      {
        heading: 'Origin',
        body:
          'Leonardo Fibonacci introduced the sequence 1, 1, 2, 3, 5, 8, 13, 21, 34… to medieval Europe in 1202 in the Liber Abaci, illustrating it with a rabbit-breeding problem; the sequence had been known in Indian mathematics since at least the 6th century CE (Pingala\'s Chandahshastra). Each successive ratio of consecutive Fibonacci numbers converges to φ ≈ 1.6180339… — the golden ratio.',
      },
      {
        heading: 'Geometry',
        body:
          'A golden spiral is a logarithmic spiral whose radial growth factor is φ per quarter turn. Its formula is r = a · φ^(2θ/π). Unlike an Archimedean spiral, the golden spiral is self-similar: every magnification is congruent to the whole. It tiles perfectly inside Fibonacci-proportioned rectangles, each successive square built on the longer side of the previous one.',
      },
      {
        heading: 'In nature',
        body:
          'The nautilus shell, the unfurling fern, the cochlea of the inner ear, the spiral arms of galaxies, hurricane systems, and the cross-section of DNA all approximate this spiral. Plant phyllotaxis — the arrangement of leaves, seeds and florets — is governed by the golden angle 137.5077…° = 2π(1 − 1/φ), giving the maximally efficient packing of new growth around a stem.',
      },
      {
        heading: 'Symbolism',
        body:
          'The golden ratio is read across architecture, music, painting and sculpture as the proportion that the human nervous system finds most beautiful. The Parthenon, the Great Pyramid, Da Vinci\'s Vitruvian Man, Le Corbusier\'s Modulor, Bartók\'s sonatas and Mozart\'s symphonies all reference it. φ is the geometry of life unfolding — neither symmetric nor chaotic, but the perfect mean between.',
      },
    ],
  },

  phyllotaxis: {
    epigraph: 'The seed pattern of the sunflower.',
    sections: [
      {
        heading: 'Origin',
        body:
          'Phyllotaxis (Greek: phyllon = leaf, taxis = arrangement) is the rule by which plants arrange leaves, petals, seeds, scales and florets around a stem. The Renaissance botanist Schimper-Braun (1830s) first quantified the patterns; Wilhelm Hofmeister and later Douady & Couder (1992) showed that the golden-angle spiral pattern emerges from a simple physical principle: each new growth-bud places itself at the angle that maximises distance from all previous buds.',
      },
      {
        heading: 'Geometry',
        body:
          'Placing the i-th seed at radius √i and angular position i × 137.5077° generates the densest non-overlapping packing on a disk. The pattern reveals two spiral families: 8 + 13 (smaller flowers), 13 + 21 (daisies), 21 + 34 (typical sunflowers), 55 + 89 (very large heads) — successive Fibonacci pairs depending on flower size.',
      },
      {
        heading: 'Symbolism',
        body:
          'Phyllotaxis is geometric proof that nature does not merely tolerate the golden angle — it requires it. It teaches that the most efficient form of growth is also the most beautiful, and that the universe organises itself through optimisation, not by command.',
      },
    ],
  },

  hexagram: {
    epigraph: 'Star of David, Seal of Solomon, the union of opposites.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The hexagram — two interpenetrating equilateral triangles — appears in archaeological record as early as Bronze-Age India and the 4th-century BCE Israel. It is recorded on a synagogue lintel at Capernaum (~300 CE) and was widely used in medieval Christian, Islamic and Jewish manuscripts. Only in the 19th century did it become specifically associated with Jewish identity, ultimately adopted on the flag of Israel in 1948.',
      },
      {
        heading: 'Geometry',
        body:
          'Two equilateral triangles of equal size, rotated 180° relative to each other, share a common centre and inscribe a regular hexagon at their intersection. Six small triangles project outward from the hexagon — the six points of the star. The figure encodes √3, the equilateral triangle, the regular hexagon, the cube\'s isometric projection, and the hexagonal close-packing lattice.',
      },
      {
        heading: 'Symbolism',
        body:
          'Across traditions the figure represents the union of opposites: fire (upward) and water (downward); spirit and matter; masculine and feminine; macrocosm and microcosm; "as above, so below" of Hermes Trismegistus. In Hindu Tantra it is the central element of the Sri Yantra; in alchemy it is the symbol of the great work.',
      },
    ],
  },

  pentagram: {
    epigraph: 'The five-pointed star, the geometry of life.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The pentagram — a five-pointed star drawn in a single unbroken line — is one of humanity\'s oldest symbols, recorded on Sumerian clay tablets dating to ~3500 BCE. The Pythagoreans took it as their secret sign; it appears in early Christian symbology, in the seal of Solomon, in Wiccan and ceremonial-magic traditions, and on the flags of more than seventy modern nations.',
      },
      {
        heading: 'Geometry',
        body:
          'The pentagram encodes the golden ratio more completely than any other plane figure. Every line is divided by every crossing into ratios involving φ: a:b = φ:1; b:c = φ:1; c:d = φ:1. The inner pentagon contains a smaller pentagram, recursively forever. The five-fold symmetry it embodies is forbidden to crystals in classical crystallography — only quasicrystals (discovered 1982) can exhibit it.',
      },
      {
        heading: 'Symbolism',
        body:
          'Five is the number of the human form — head, two arms, two legs — and of the senses, the seasons of growth, and the elements (when aether is counted). Upright, the pentagram is the human standing in their cosmic geometry. Inverted, it has carried various readings; in modern Wicca it remains a protective sign of life and elemental balance.',
      },
    ],
  },

  starOfLakshmi: {
    epigraph: 'Octagram of the goddess of fortune.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The Star of Lakshmi — two squares offset 45° to form an eight-pointed star — is the symbol of Ashtalakshmi, the eight manifestations of the Hindu goddess Lakshmi (wealth, prosperity, abundance, beauty, fertility, wisdom, courage, and dharma). It appears across Indian art and architecture for at least two millennia and is also found in Sufi geometry, in the Christian baptism font (octagonal), and on the Seal of Melchizedek.',
      },
      {
        heading: 'Geometry',
        body:
          'Two congruent squares, the second rotated 45°, share a common centre. Their union projects an eight-pointed star whose vertices sit on a circumscribed circle; their intersection is a regular octagon. Each side ratio is 1 : √2. The figure is the simplest 8-fold dihedral symmetry.',
      },
      {
        heading: 'Symbolism',
        body:
          'Eight is the number of resurrection, of the new day after the seven, and of the cardinal and intercardinal directions. In Hindu cosmology the eight forms of Lakshmi are eight forms of abundance; in Christian baptism the octagonal font marks rebirth after the seven days of creation. Across traditions the octagram is read as the regenerative completion of the work of the hexagonal world.',
      },
    ],
  },

  cuboctahedron: {
    epigraph: 'The Vector Equilibrium — Bucky\'s perfect balance.',
    sections: [
      {
        heading: 'Origin',
        body:
          'The cuboctahedron is an Archimedean solid first described by Archimedes himself (3rd c. BCE). R. Buckminster Fuller (1895–1983) renamed it the Vector Equilibrium because it is the only polyhedron in which every edge has the same length as the distance from any vertex to the centre — making it the unique form in which all vectorial forces are perfectly balanced. Fuller treated it as the zero-point geometry of energetic systems.',
      },
      {
        heading: 'Geometry',
        body:
          'Twelve vertices, twenty-four edges, eight triangular faces and six square faces. Its twelve vertices are the centres of the twelve closest spheres in a face-centred cubic close-packing lattice — the densest packing of equal spheres in three-dimensional space. It is the dual of the rhombic dodecahedron, and it can be unfolded into a Jitterbug transformation that morphs continuously through icosahedron and octahedron forms.',
      },
      {
        heading: 'Symbolism',
        body:
          'For Fuller the cuboctahedron was the geometric truth of stasis-without-rigidity — a zero-state from which all transformation begins. In modern energetics it is read as the figure of equipoise, the still point at the centre of every cycle of breath, every wave, every revolution.',
      },
    ],
  },
};

export function getLore(type: ShapeType): { epigraph?: string; sections: LoreSection[] } {
  return SHAPE_LORE[type];
}
