export const operatorHandlers = {
    number: {
        gt: (a, b) => a > b,
        gte: (a, b) => a >= b,
        lt: (a, b) => a < b,
        lte: (a, b) => a <= b,
        eq: (a, b) => a === b,
        neq: (a, b) => a !== b
    },
    boolean: {
        eq: (a, b) => a === b,
        neq: (a, b) => a !== b
    },
    string: {
        eq: (a, b) => a === b,
        neq: (a, b) => a !== b,
        contains: (a, b) => a.includes(b)
    }
};
