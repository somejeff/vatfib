const VatFib = require("../VatFib");

describe("Terminal Ranges", () => {
  it("should expand the array when a range is provided", () => {
    const fib = new VatFib({
      terminals: [
        {
          // expands to 3 terminals
          name: "{1..3}",
          // keeps values
          foo: true,
        },
      ],
    });

    expect(fib.config.terminals).toMatchObject([
      {
        name: "1",
        foo: true,
      },
      {
        name: "2",
        foo: true,
      },
      {
        name: "3",
        foo: true,
      },
    ]);
  });

  it("should support leading zeros", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "{0000..0005}",
        },
      ],
    });

    expect(fib.config.terminals.at(0).name).toBe("0000")
    expect(fib.config.terminals.at(-1).name).toBe("0005")
    expect(fib.config.terminals.length).toBe(6)
  });

  it("should use only the start number for padding length?", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "{00..010}",
        },
      ],
    });

    expect(fib.config.terminals.at(0).name).toBe("00")
    expect(fib.config.terminals.at(-1).name).toBe("10")
    expect(fib.config.terminals.length).toBe(11)
  });
  


  it("should support a prefix", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "T{1..1}",
        },
      ],
    });

    expect(fib.config.terminals).toMatchObject([
      {
        name: "T1",
      },
    ]);
  });

  it("should retain spaces in the prefix", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: " T  {1..1}",
        },
      ],
    });

    expect(fib.config.terminals).toMatchObject([
      {
        name: " T  1",
      },
    ]);
  });

  it("should support a prefix", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "{1..1}A",
        },
      ],
    });

    expect(fib.config.terminals).toMatchObject([
      {
        name: "1A",
      },
    ]);
  });

  it("should retain spaces in the suffix", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "{1..1} A  ",
        },
      ],
    });

    expect(fib.config.terminals).toMatchObject([
      {
        name: "1 A  ",
      },
    ]);
  });

  it("should support and not modify prefixes and suffixes", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "(Term-{1..1}_ [A]!",
        },
      ],
    });

    expect(fib.config.terminals).toMatchObject([
      {
        name: "(Term-1_ [A]!",
      },
    ]);
  });
});

describe("Terminal Fixed and Ranged combined", () => {
  it("should keep fixed terminals untouched and expand ranged terminals", () => {
    const fib = new VatFib({
      terminals: [
        {
          name: "T-Fixed",
        },
        {
          name: "T{1..3}",
        },
        {
          name: "T-Other Fixed",
        },
        {
          name: "T{005..006}",
        },
      ],
    });
    expect(fib.config.terminals).toMatchObject([
      {
        name: "T-Fixed",
      },
      {
        name: "T1",
      },
      {
        name: "T2",
      },
      {
        name: "T3",
      },
      {
        name: "T-Other Fixed",
      },
      {
        name: "T005",
      },
      {
        name: "T006",
      },
    ]);
  });
});
