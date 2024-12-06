import { expect, test } from 'vitest'
import { trans, Z, termToString, ONE_B, ec } from './code.ts'
import { Scanner } from './parse.ts';

const options = {
  checkOnOffo: false,
  checkOnOffO: false,
  checkOnOffA: false,
  checkOnOffB: false,
  checkOnOffT: false,
}

test('truns(0) === 0', () => {
  expect(trans(Z)).toStrictEqual(Z)
})

test('truns(1) === 1', () => {
  const x = new Scanner("1").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("1")
})

test('truns(w) === ψ_0(1)', () => {
  const x = new Scanner("w").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(1)")
})

test('truns(A(w)) === ψ_0(ψ_0(1))', () => {
  const x = new Scanner("A(w)").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(ψ_0(1))")
})

test('truns(A(w+1)) === ψ_0(ψ_0(1)+1)', () => {
  const x = new Scanner("A(w+1)").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(ψ_0(1)+1)")
})

test('truns(A(A(1,0))) === ψ_0(ψ_1(0))', () => {
  const x = new Scanner("A(A(1,0))").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(ψ_1(0))")
})

test('truns(A(A(1,0)+A(1))) === ψ_0(ψ_1(0)+ψ_0(1))', () => {
  const x = new Scanner("A(A(1,0)+A(1))").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(ψ_1(0)+ψ_0(1))")
})

test('truns(A(A(1,0)+A(A(1)))) === ψ_0(ψ_1(0)+ψ_0(ψ_0(1)))', () => {
  const x = new Scanner("A(A(1,0)+A(A(1)))").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(ψ_1(0)+ψ_0(ψ_0(1)))")
})

test('truns(A(A(1,0)+A(A(1,0)))) === ψ_0(ψ_1(0)+ψ_0(ψ_1(0)))', () => {
  const x = new Scanner("A(A(1,0)+A(A(1,0)))").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(ψ_1(0)+ψ_0(ψ_1(0)))")
})

test('truns(A(A(1,0)+A(A(1,0)+A(A(1,0))))) === ψ_0(ψ_1(0)+ψ_0(ψ_1(0)+ψ_0(ψ_1(0))))', () => {
  const x = new Scanner("A(A(1,0)+A(A(1,0)+A(A(1,0))))").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(ψ_1(0)+ψ_0(ψ_1(0)+ψ_0(ψ_1(0))))")
})

test('truns(A(A(1,0)+A(1,0))) === ψ_0(ψ_1(0)+ψ_1(0))', () => {
  const x = new Scanner("A(A(1,0)+A(1,0))").parse_term()
  expect(termToString(trans(x), options)).toStrictEqual("ψ_0(ψ_1(0)+ψ_1(0))")
})

test('truns(A(A(1,1))) === ψ_0(ψ_1(1))', () => {
  const x = new Scanner("A(A(1,1))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(1))")
})

test('truns(A(A(1,A(1,0)))) === ψ_0(ψ_1(ψ_0(ψ_1(0))))', () => {
  const x = new Scanner("A(A(1,A(1,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0))))")
})

test('truns(A(A(1,A(1,0))+A(1,0))) === ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(0))', () => {
  const x = new Scanner("A(A(1,A(1,0))+A(1,0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(0))")
})

test('truns(A(A(1,A(1,0))+A(1,0)+A(1,0))) === ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(0)+ψ_1(0))', () => {
  const x = new Scanner("A(A(1,A(1,0))+A(1,0)+A(1,0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(0)+ψ_1(0))")
})

test('truns(A(A(1,A(1,0))+A(1,1))) === ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(1))', () => {
  const x = new Scanner("A(A(1,A(1,0))+A(1,1))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(1))")
})

test('truns(A(A(1,A(1,0))+A(1,w))) === ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(ψ_0(1)))', () => {
  const x = new Scanner("A(A(1,A(1,0))+A(1,w))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(ψ_0(1)))")
})

test('truns(A(A(1,A(1,0))+A(1,A(1,0)))) === ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(ψ_0(ψ_1(0))))', () => {
  const x = new Scanner("A(A(1,A(1,0))+A(1,A(1,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(ψ_0(ψ_1(0))))")
})

test('truns(A(A(1,A(1,0))+A(1,A(1,0))+A(1,A(1,0)))) === ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(ψ_0(ψ_1(0)))+ψ_1(ψ_0(ψ_1(0))))', () => {
  const x = new Scanner("A(A(1,A(1,0))+A(1,A(1,0))+A(1,A(1,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)))+ψ_1(ψ_0(ψ_1(0)))+ψ_1(ψ_0(ψ_1(0))))")
})

test('truns(A(A(1,A(1,0)+1))) === ψ_0(ψ_1(ψ_0(ψ_1(0))+1))', () => {
  const x = new Scanner("A(A(1,A(1,0)+1))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0))+1))")
})

test('truns(A(A(1,A(1,0)+2))) === ψ_0(ψ_1(ψ_0(ψ_1(0))+2))', () => {
  const x = new Scanner("A(A(1,A(1,0)+2))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0))+2))")
})

test('truns(A(A(1,A(1,0)+w))) === ψ_0(ψ_1(ψ_0(ψ_1(0))+ψ_0(1)))', () => {
  const x = new Scanner("A(A(1,A(1,0)+w))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0))+ψ_0(1)))")
})

test('truns(A(A(1,A(1,0)+A(A(1,0))))) === ψ_0(ψ_1(ψ_0(ψ_1(0))+ψ_0(ψ_1(0))))', () => {
  const x = new Scanner("A(A(1,A(1,0)+A(A(1,0))))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0))+ψ_0(ψ_1(0))))")
})

test('truns(A(A(1,A(1,0)+A(A(1,0)+1)))) === ψ_0(ψ_1(ψ_0(ψ_1(0)+1)))', () => {
  const x = new Scanner("A(A(1,A(1,0)+A(A(1,0)+1)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)+1)))")
})

test('truns(A(A(1,A(1,0)+A(A(1,0)+w)))) === ψ_0(ψ_1(ψ_0(ψ_1(0)+ψ_0(1))))', () => {
  const x = new Scanner("A(A(1,A(1,0)+A(A(1,0)+w)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)+ψ_0(1))))")
})

test('truns(A(A(1,A(1,0)+A(A(1,0)+A(A(1,0)))))) === ψ_0(ψ_1(ψ_0(ψ_1(0)+ψ_0(ψ_1(0)))))', () => {
  const x = new Scanner("A(A(1,A(1,0)+A(A(1,0)+A(A(1,0)))))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)+ψ_0(ψ_1(0)))))")
})

test('truns(A(A(1,A(1,0)+A(A(1,0)+A(A(1,0)))))) === ψ_0(ψ_1(ψ_0(ψ_1(0)+ψ_0(ψ_1(0)))))', () => {
  const x = new Scanner("A(A(1,A(1,0)+A(A(1,0)+A(A(1,0)))))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)+ψ_0(ψ_1(0)))))")
})

test('truns(A(A(1,A(1,0)+A(1,0)))) === ψ_0(ψ_1(ψ_0(ψ_1(0)+ψ_1(0))))', () => {
  const x = new Scanner("A(A(1,A(1,0)+A(1,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(0)+ψ_1(0))))")
})

test('truns(A(A(1,A(1,1)))) === ψ_0(ψ_1(ψ_0(ψ_1(1))))', () => {
  const x = new Scanner("A(A(1,A(1,1)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(1))))")
})

test('truns(A(A(1,A(1,w)))) === ψ_0(ψ_1(ψ_0(ψ_1(ψ_0(1)))))', () => {
  const x = new Scanner("A(A(1,A(1,w)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(ψ_0(1)))))")
})

test('truns(A(A(1,A(1,A(1,0))))) === ψ_0(ψ_1(ψ_0(ψ_1(ψ_0(ψ_1(0))))))', () => {
  const x = new Scanner("A(A(1,A(1,A(1,0))))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_0(ψ_1(ψ_0(ψ_1(0))))))")
})

test('truns(A(A(2,0))) === ψ_0(ψ_1(ψ_1(0)))', () => {
  const x = new Scanner("A(A(2,0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0)))")
})

test('truns(A(A(2,0)+A(A(2,0)))) === ψ_0(ψ_1(ψ_1(0))+ψ_0(ψ_1(ψ_1(0))))', () => {
  const x = new Scanner("A(A(2,0)+A(A(2,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_0(ψ_1(ψ_1(0))))")
})

test('truns(A(A(2,0)+A(1,0))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(0))', () => {
  const x = new Scanner("A(A(2,0)+A(1,0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(0))")
})

test('truns(A(A(2,0)+A(1,0)+A(1,0))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(0)+ψ_1(0))', () => {
  const x = new Scanner("A(A(2,0)+A(1,0)+A(1,0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(0)+ψ_1(0))")
})

test('truns(A(A(2,0)+A(1,1))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(1))', () => {
  const x = new Scanner("A(A(2,0)+A(1,1))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(1))")
})

test('truns(A(A(2,0)+A(1,w))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(1)))', () => {
  const x = new Scanner("A(A(2,0)+A(1,w))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(1)))")
})

test('truns(A(A(2,0)+A(1,A(1,0)))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(0))))', () => {
  const x = new Scanner("A(A(2,0)+A(1,A(1,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(0))))")
})

test('truns(A(A(2,0)+A(1,A(1,A(1,0))))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(ψ_0(ψ_1(0))))))', () => {
  const x = new Scanner("A(A(2,0)+A(1,A(1,A(1,0))))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(ψ_0(ψ_1(0))))))")
})

test('truns(A(A(2,0)+A(1,A(2,0)))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(ψ_1(0)))))', () => {
  const x = new Scanner("A(A(2,0)+A(1,A(2,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(ψ_1(0)))))")
})

test('truns(A(A(2,0)+A(1,A(2,0)+A(1,A(2,0))))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(ψ_1(0)))))))', () => {
  const x = new Scanner("A(A(2,0)+A(1,A(2,0)+A(1,A(2,0))))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_0(ψ_1(ψ_1(0)))))))")
})

test('truns(A(A(2,0)+A(2,0))) === ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_1(0)))', () => {
  const x = new Scanner("A(A(2,0)+A(2,0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(0))+ψ_1(ψ_1(0)))")
})

test('truns(A(I+A(I,0))) === ψ_0(ψ_2(0)+ψ_1(ψ_2(0)))', () => {
  const x = new Scanner("A(I+A(I,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_2(0)+ψ_1(ψ_2(0)))")
})

test('ec(n,1) === 1', () => {
  expect(termToString(ec(2, ONE_B), options)).toBe("1")
})

test('truns(I) === ψ_2(0)', () => {
  const x = new Scanner("I").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_2(0)")
})

test('truns(A(I)) === ψ_0(ψ_2(0))', () => {
  const x = new Scanner("A(I)").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_2(0))")
})

test('truns(A(I,0)) === ψ_1(ψ_2(0))', () => {
  const x = new Scanner("A(I,0)").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_1(ψ_2(0))")
})

test('truns(A(0,0,A(1,0,0)+A(0,A(1,0,0),A(0,1,0)))) === ψ_0(ψ_2(0)+ψ_1(ψ_2(0)+ψ_0(ψ_1(0))))', () => {
  const x = new Scanner("A(0,0,A(1,0,0)+A(0,A(1,0,0),A(0,1,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_2(0)+ψ_1(ψ_2(0)+ψ_0(ψ_1(0))))")
})

test('truns(A(0,0,A(1,0,0)+A(0,A(1,0,0),A(0,1,0)))) === ψ_0(ψ_2(0)+ψ_1(ψ_2(0)+ψ_0(ψ_1(0))))', () => {
  const x = new Scanner("A(0,0,A(1,0,0)+A(0,A(1,0,0),A(0,1,0)))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_2(0)+ψ_1(ψ_2(0)+ψ_0(ψ_1(0))))")
})

test('truns(A(0,0,A(A(0,A(A(0,A(1,0,0),0),0,0),0),0,0))) === ψ_0(ψ_2(ψ_2(ψ_1(ψ_2(ψ_2(ψ_1(ψ_2(0))))))))', () => {
  const x = new Scanner("A(0,0,A(A(0,A(A(0,A(1,0,0),0),0,0),0),0,0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_2(ψ_2(ψ_1(ψ_2(ψ_2(ψ_1(ψ_2(0))))))))")
})

test('truns(亞_0(亞_{亞_1(0)}(0)+亞_{亞_0(亞_{亞_1(0)}(0)+亞_0(亞_{亞_1(0)}(0)+1))}(0))) === ψ_0(ψ_1(ψ_1(ψ_1(0)))+ψ_1(ψ_1(ψ_0(ψ_1(ψ_1(ψ_1(0)))+1))))', () => {
  const x = new Scanner("亞_0(亞_{亞_1(0)}(0)+亞_{亞_0(亞_{亞_1(0)}(0)+亞_0(亞_{亞_1(0)}(0)+1))}(0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_1(ψ_1(ψ_1(0)))+ψ_1(ψ_1(ψ_0(ψ_1(ψ_1(ψ_1(0)))+1))))")
})

test('truns(A(0,0,A(1,A(1,0,0)+A(0,A(1,0,0),1),0))) === ψ_0(ψ_2(ψ_1(ψ_2(0)+1)))', () => {
  const x = new Scanner("A(0,0,A(1,A(1,0,0)+A(0,A(1,0,0),1),0))").parse_term()
  expect(termToString(trans(x), options)).toBe("ψ_0(ψ_2(ψ_1(ψ_2(0)+1)))")
})

test('ec(2,A(0,A(1,0,0),0)) === ψ_1(ψ_2(0))', () => {
  const x = new Scanner("A(0,A(1,0,0),0)").parse_term()
  expect(termToString(ec(2, trans(x)), options)).toBe("ψ_1(ψ_2(0))")
})

test('ec(1,A(A(0,A(1,0,0),0),0,0)) === ψ_1(ψ_2(0))', () => {
  const x = new Scanner("A(A(0,A(1,0,0),0),0,0)").parse_term()
  expect(termToString(ec(1, trans(x)), options)).toBe("ψ_1(ψ_2(ψ_2(ψ_1(ψ_2(0)))))")
})