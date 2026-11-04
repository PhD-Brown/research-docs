# Model notes

## ΛCDM

The standard flat ΛCDM model assumes a cosmological constant:

\[
w=-1.
\]

For a flat universe:

\[
E^2(z)=\Omega_m(1+z)^3+(1-\Omega_m).
\]

## CPL

The Chevallier--Polarski--Linder parameterization is:

\[
w(z)=w_0+w_a\frac{z}{1+z}.
\]

The dark-energy density evolves as:

\[
\rho_{DE}(z)\propto(1+z)^{3(1+w_0+w_a)}\exp\left[-3w_a\frac{z}{1+z}\right].
\]

## Ξosc

The exploratory oscillating model is implemented as:

\[
w(t)=w_{0,\mathrm{mean}}+\epsilon\cos\left(\frac{2\pi t}{T}+\phi_0\right).
\]

This is a phenomenological test. The parameter \(\epsilon\) is the main amplitude parameter of interest. If \(\epsilon=0\), the explicit oscillatory component disappears.

## Distances

For supernovae:

\[
\mu_{th}(z)=5\log_{10}\left(\frac{D_L(z)}{\mathrm{Mpc}}\right)+25.
\]

For BAO:

\[
D_H(z)=\frac{c}{H(z)}, \qquad D_M(z)=D_C(z) \quad (\Omega_k=0),
\]

and:

\[
D_V(z)=\left[zD_M^2(z)D_H(z)\right]^{1/3}.
\]
