const { VatFib } = require("../VatFib");

describe("Gate Ranges", () => {
  it("should expand the array when a range is provided", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "1",
          gates: [
            {
              name: "G{1..2}",
              foo: true,
            },
          ],
          // keeps values
          foo: true,
        },
        {
          name: "2",
          gates: [
            {
              name: "G{3..4}",
              foo: false,
            },
          ],
          // keeps values
          foo: false,
        },
      ],
    });

    expect(fib.config.terminals).toMatchObject([
      {
        name: "1",
        gates: [
          {
            name: "G1",
            foo: true,
          },
          {
            name: "G2",
            foo: true,
          },
        ],
        foo: true,
      },
      {
        name: "2",
        gates: [
          {
            name: "G3",
            foo: false,
          },
          {
            name: "G4",
            foo: false,
          },
        ],
        foo: false,
      },
    ]);
  });

  it("should support leading zeros", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "T1",
          gates: [
            {
              name: "{0000..0005}",
            },
          ],
        },
      ],
    });

    expect(fib.config.terminals[0].gates.at(0).name).toBe("0000");
    expect(fib.config.terminals[0].gates.at(-1).name).toBe("0005");
    expect(fib.config.terminals[0].gates.length).toBe(6);
  });

  it("should use only the start number for padding length?", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "T1",
          gates: [
            {
              name: "{00..010}",
            },
          ],
        },
      ],
    });

    expect(fib.config.terminals[0].gates.at(0).name).toBe("00");
    expect(fib.config.terminals[0].gates.at(-1).name).toBe("10");
    expect(fib.config.terminals[0].gates.length).toBe(11);
  });

  it("should support a prefix", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "T1",
          gates: [
            {
              name: "G{1..1}",
            },
          ],
        },
      ],
    });

    expect(fib.config.terminals).toMatchObject([
      {
        name: "T1",
        gates: [
          {
            name: "G1",
          },
        ],
      },
    ]);
  });

  it("should retain spaces in the prefix", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "T1",
          gates: [
            {
              name: " G  {1..1}",
            },
          ],
        },
      ],
    });

    expect(fib.config.terminals).toMatchObject([
      {
        name: "T1",
        gates: [
          {
            name: " G  1",
          },
        ],
      },
    ]);
  });

  it("should support a prefix", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "T1",
          gates: [
            {
              name: "{1..1}G",
            },
          ],
        },
      ],
    });

    expect(fib.config.terminals).toMatchObject([
      {
        name: "T1",
        gates: [
          {
            name: "1G",
          },
        ],
      },
    ]);
  });

  it("should retain spaces in the suffix", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "T1",
          gates: [
            {
              name: "{1..1} A  ",
            },
          ],
        },
      ],
    });

    expect(fib.config.terminals).toMatchObject([
      {
        name: "T1",
        gates: [
          {
            name: "1 A  ",
          },
        ],
      },
    ]);
  });

  it("should support and not modify prefixes and suffixes", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "T1",
          gates: [
            {
              name: "(Gate-{1..1}_ [A]!",
            },
          ],
        },
      ],
    });

    expect(fib.config.terminals).toMatchObject([
      {
        name: "T1",
        gates: [
          {
            name: "(Gate-1_ [A]!",
          },
        ],
      },
    ]);
  });
});

describe("Mixed Fixed and ranged Gates", () => {
  it("should keep fixed gates untouched and expand ranged gates", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "T1",
          gates: [
            {
              name: "G-Fixed",
            },
            {
              name: "G{1..3}",
            },
            {
              name: "G-Other Fixed",
            },
            {
              name: "G{005..006}",
            },
          ],
        },
      ],
    });
    expect(fib.config.terminals).toMatchObject([
      {
        name: "T1",
        gates: [
          {
            name: "G-Fixed",
          },
          {
            name: "G1",
          },
          {
            name: "G2",
          },
          {
            name: "G3",
          },
          {
            name: "G-Other Fixed",
          },
          {
            name: "G005",
          },
          {
            name: "G006",
          },
        ],
      },
    ]);
  });
});

describe("Multiple Terminal and gate expansion", () => {
  it("should expand terminals and respective gates", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "T{1..2}",
          gates: [
            {
              name: "G{1..2}",
            },
          ],
        },
      ],
    });
    expect(fib.config.terminals).toMatchObject([
      {
        name: "T1",
        gates: [
          {
            name: "G1",
          },
          {
            name: "G2",
          },
        ],
      },
      {
        name: "T2",
        gates: [
          {
            name: "G1",
          },
          {
            name: "G2",
          },
        ],
      },
    ]);
  });
});
