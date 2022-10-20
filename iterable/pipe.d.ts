type Func<A, B> =
  | ((d: A) => Promise<B | undefined>)
  | ((d: A) => B | undefined);

export function pipe<A>(): (d: A) => AsyncGenerator<A> | AsyncIterable<A>;
export function pipe<A, B>(
  f1: Func<A, B>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<B>;
export function pipe<A, B, C>(
  f1: Func<A, B>,
  f2: Func<B, C>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<C>;
export function pipe<A, B, C, D>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<D>;
export function pipe<A, B, C, D, E>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<E>;
export function pipe<A, B, C, D, E, F>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<F>;
export function pipe<A, B, C, D, E, F, G>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<G>;
export function pipe<A, B, C, D, E, F, G, H>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<H>;
export function pipe<A, B, C, D, E, F, G, H, I>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<I>;
export function pipe<A, B, C, D, E, F, G, H, I, J>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
  f9: Func<I, J>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<J>;
export function pipe<A, B, C, D, E, F, G, H, I, J, K>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
  f9: Func<I, J>,
  f10: Func<J, K>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<K>;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
  f9: Func<I, J>,
  f10: Func<J, K>,
  f11: Func<K, L>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<L>;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
  f9: Func<I, J>,
  f10: Func<J, K>,
  f11: Func<K, L>,
  f12: Func<L, M>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<M>;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
  f9: Func<I, J>,
  f10: Func<J, K>,
  f11: Func<K, L>,
  f12: Func<L, M>,
  f13: Func<M, N>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<N>;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
  f9: Func<I, J>,
  f10: Func<J, K>,
  f11: Func<K, L>,
  f12: Func<L, M>,
  f13: Func<M, N>,
  f14: Func<N, O>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<O>;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
  f9: Func<I, J>,
  f10: Func<J, K>,
  f11: Func<K, L>,
  f12: Func<L, M>,
  f13: Func<M, N>,
  f14: Func<N, O>,
  f15: Func<O, P>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<P>;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
  f9: Func<I, J>,
  f10: Func<J, K>,
  f11: Func<K, L>,
  f12: Func<L, M>,
  f13: Func<M, N>,
  f14: Func<N, O>,
  f15: Func<O, P>,
  f16: Func<P, Q>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<Q>;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
  f9: Func<I, J>,
  f10: Func<J, K>,
  f11: Func<K, L>,
  f12: Func<L, M>,
  f13: Func<M, N>,
  f14: Func<N, O>,
  f15: Func<O, P>,
  f16: Func<P, Q>,
  f17: Func<Q, R>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<R>;
export function pipe<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
  f9: Func<I, J>,
  f10: Func<J, K>,
  f11: Func<K, L>,
  f12: Func<L, M>,
  f13: Func<M, N>,
  f14: Func<N, O>,
  f15: Func<O, P>,
  f16: Func<P, Q>,
  f17: Func<Q, R>,
  f18: Func<R, S>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<S>;
export function pipe<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
  f9: Func<I, J>,
  f10: Func<J, K>,
  f11: Func<K, L>,
  f12: Func<L, M>,
  f13: Func<M, N>,
  f14: Func<N, O>,
  f15: Func<O, P>,
  f16: Func<P, Q>,
  f17: Func<Q, R>,
  f18: Func<R, S>,
  f19: Func<S, T>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<T>;
export function pipe<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
  f9: Func<I, J>,
  f10: Func<J, K>,
  f11: Func<K, L>,
  f12: Func<L, M>,
  f13: Func<M, N>,
  f14: Func<N, O>,
  f15: Func<O, P>,
  f16: Func<P, Q>,
  f17: Func<Q, R>,
  f18: Func<R, S>,
  f19: Func<S, T>,
  f20: Func<T, U>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<U>;
export function pipe<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
  f9: Func<I, J>,
  f10: Func<J, K>,
  f11: Func<K, L>,
  f12: Func<L, M>,
  f13: Func<M, N>,
  f14: Func<N, O>,
  f15: Func<O, P>,
  f16: Func<P, Q>,
  f17: Func<Q, R>,
  f18: Func<R, S>,
  f19: Func<S, T>,
  f20: Func<T, U>,
  f21: Func<U, V>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<V>;
export function pipe<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
  f9: Func<I, J>,
  f10: Func<J, K>,
  f11: Func<K, L>,
  f12: Func<L, M>,
  f13: Func<M, N>,
  f14: Func<N, O>,
  f15: Func<O, P>,
  f16: Func<P, Q>,
  f17: Func<Q, R>,
  f18: Func<R, S>,
  f19: Func<S, T>,
  f20: Func<T, U>,
  f21: Func<U, V>,
  f22: Func<V, W>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<W>;
export function pipe<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
  f9: Func<I, J>,
  f10: Func<J, K>,
  f11: Func<K, L>,
  f12: Func<L, M>,
  f13: Func<M, N>,
  f14: Func<N, O>,
  f15: Func<O, P>,
  f16: Func<P, Q>,
  f17: Func<Q, R>,
  f18: Func<R, S>,
  f19: Func<S, T>,
  f20: Func<T, U>,
  f21: Func<U, V>,
  f22: Func<V, W>,
  f23: Func<W, X>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<X>;
export function pipe<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y,
>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
  f9: Func<I, J>,
  f10: Func<J, K>,
  f11: Func<K, L>,
  f12: Func<L, M>,
  f13: Func<M, N>,
  f14: Func<N, O>,
  f15: Func<O, P>,
  f16: Func<P, Q>,
  f17: Func<Q, R>,
  f18: Func<R, S>,
  f19: Func<S, T>,
  f20: Func<T, U>,
  f21: Func<U, V>,
  f22: Func<V, W>,
  f23: Func<W, X>,
  f24: Func<X, Y>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<Y>;
export function pipe<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y,
  Z,
>(
  f1: Func<A, B>,
  f2: Func<B, C>,
  f3: Func<C, D>,
  f4: Func<D, E>,
  f5: Func<E, F>,
  f6: Func<F, G>,
  f7: Func<G, H>,
  f8: Func<H, I>,
  f9: Func<I, J>,
  f10: Func<J, K>,
  f11: Func<K, L>,
  f12: Func<L, M>,
  f13: Func<M, N>,
  f14: Func<N, O>,
  f15: Func<O, P>,
  f16: Func<P, Q>,
  f17: Func<Q, R>,
  f18: Func<R, S>,
  f19: Func<S, T>,
  f20: Func<T, U>,
  f21: Func<U, V>,
  f22: Func<V, W>,
  f23: Func<W, X>,
  f24: Func<X, Y>,
  f25: Func<Y, Z>,
): (d: AsyncGenerator<A> | AsyncIterable<A>) => AsyncGenerator<Z>;