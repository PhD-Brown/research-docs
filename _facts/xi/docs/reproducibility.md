# Reproducibility notes

## Final exploratory run

The final long run used in the report was:

```bash
python src/xi_protocol1b_bao_run.py --nsteps 100000 --burn-in 20000 --nwalkers 96
```

A PowerShell logging version is:

```powershell
python .\src\xi_protocol1b_bao_run.py --nsteps 100000 --burn-in 20000 --nwalkers 96 2>&1 | Tee-Object results\run_100000_96.log
```

## Convergence criterion used

The practical criterion used here is:

\[
N/50 > \tau_{\max},
\]

where \(N\) is the number of MCMC steps per walker and \(\tau_{\max}\) is the largest integrated autocorrelation time estimate returned by `emcee`.

For the long run:

\[
N/50=100000/50=2000,
\]

and for Ξosc:

\[
\tau_{\max}\approx1504.
\]

Thus the practical criterion is satisfied, although \(T\) and \(\phi_0\) remain physically broad and weakly constrained.

## Recommended public wording

Use cautious language:

> This exploratory analysis finds that the oscillating model has the best raw χ² and remains close to CPL according to AIC, with an amplitude ε around 2.3σ. This should not be interpreted as a definitive detection of oscillating dark energy.
