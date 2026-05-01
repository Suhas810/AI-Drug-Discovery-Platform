"""
AI-Driven Drug Discovery Platform
Drug Candidate Exploration Dashboard

A Streamlit application for exploring drug discovery data across multiple diseases.
Run with: streamlit run app.py
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import io

# ──────────────────────────────────────────────
# PAGE CONFIG
# ──────────────────────────────────────────────
st.set_page_config(
    page_title="AI Drug Discovery Platform",
    page_icon="🧬",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ──────────────────────────────────────────────
# CUSTOM CSS  – dark biotech aesthetic
# ──────────────────────────────────────────────
st.markdown("""
<style>
/* ── Google Fonts ── */
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

/* ── Root palette ── */
:root {
    --bg:        #080d14;
    --surface:   #0d1520;
    --card:      #111c2d;
    --border:    #1e3050;
    --accent:    #00e5ff;
    --accent2:   #7b61ff;
    --accent3:   #00ff9d;
    --text:      #cdd9e8;
    --muted:     #5a7a9a;
    --danger:    #ff4f6b;
}

/* ── Global reset ── */
html, body, [data-testid="stAppViewContainer"] {
    background-color: var(--bg) !important;
    color: var(--text) !important;
    font-family: 'DM Sans', sans-serif !important;
}

[data-testid="stSidebar"] {
    background-color: var(--surface) !important;
    border-right: 1px solid var(--border);
}

/* ── Header banner ── */
.hero-banner {
    background: linear-gradient(135deg, #0d1520 0%, #081422 50%, #0a1a30 100%);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2.2rem 2.8rem;
    margin-bottom: 1.8rem;
    position: relative;
    overflow: hidden;
}
.hero-banner::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(0,229,255,.06) 0%, transparent 70%),
                radial-gradient(ellipse 40% 60% at 20% 30%, rgba(123,97,255,.06) 0%, transparent 70%);
    pointer-events: none;
}
.hero-title {
    font-family: 'Space Mono', monospace !important;
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: -0.5px;
    margin: 0 0 .3rem 0;
    text-shadow: 0 0 30px rgba(0,229,255,.4);
}
.hero-sub {
    font-size: 1rem;
    color: var(--muted);
    font-weight: 300;
    letter-spacing: .5px;
}

/* ── Section labels ── */
.section-label {
    font-family: 'Space Mono', monospace;
    font-size: .68rem;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: .5rem;
}

/* ── Cards ── */
.stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.3rem 1.5rem;
    text-align: center;
}
.stat-value {
    font-family: 'Space Mono', monospace;
    font-size: 2.1rem;
    font-weight: 700;
    color: var(--accent);
}
.stat-label {
    font-size: .78rem;
    color: var(--muted);
    margin-top: .2rem;
    letter-spacing: 1px;
    text-transform: uppercase;
}

/* ── Drug detail card ── */
.drug-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    border-radius: 12px;
    padding: 1.4rem 1.7rem;
    margin-top: .8rem;
}
.drug-card-title {
    font-family: 'Space Mono', monospace;
    font-size: 1.1rem;
    color: var(--accent);
    margin-bottom: 1rem;
}
.drug-field-label {
    font-size: .72rem;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 1px;
}
.drug-field-value {
    font-size: 1rem;
    color: var(--text);
    font-weight: 500;
    margin-top: .15rem;
    margin-bottom: .9rem;
}

/* ── AI coming-soon banner ── */
.ai-banner {
    background: linear-gradient(120deg, #0d1a30 0%, #0e1528 100%);
    border: 1px dashed var(--accent2);
    border-radius: 14px;
    padding: 2rem 2.4rem;
    margin-top: 1rem;
}
.ai-banner-title {
    font-family: 'Space Mono', monospace;
    font-size: 1.15rem;
    color: var(--accent2);
    margin-bottom: .6rem;
}
.ai-banner-body {
    color: var(--muted);
    font-size: .9rem;
    line-height: 1.7;
}
.badge {
    display: inline-block;
    background: rgba(123,97,255,.15);
    color: var(--accent2);
    font-size: .68rem;
    font-family: 'Space Mono', monospace;
    letter-spacing: 1.5px;
    padding: .25rem .7rem;
    border-radius: 100px;
    border: 1px solid rgba(123,97,255,.3);
    margin-bottom: 1rem;
}

/* ── Upload zone ── */
[data-testid="stFileUploader"] {
    background: var(--card) !important;
    border: 1px dashed var(--border) !important;
    border-radius: 10px !important;
    padding: .6rem !important;
}

/* ── Dataframe ── */
[data-testid="stDataFrame"] {
    border: 1px solid var(--border) !important;
    border-radius: 10px !important;
}

/* ── Metric overrides ── */
[data-testid="stMetric"] {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1rem 1.2rem;
}
[data-testid="stMetricValue"] {
    color: var(--accent) !important;
    font-family: 'Space Mono', monospace !important;
}

/* ── Sidebar labels ── */
[data-testid="stSidebar"] label,
[data-testid="stSidebar"] .stSelectbox label,
[data-testid="stSidebar"] .stTextInput label {
    color: var(--muted) !important;
    font-size: .78rem;
    letter-spacing: 1px;
    text-transform: uppercase;
}

/* ── Selectbox / input text ── */
.stSelectbox > div > div,
.stTextInput > div > div > input {
    background: var(--surface) !important;
    border: 1px solid var(--border) !important;
    color: var(--text) !important;
    border-radius: 8px !important;
}

/* ── Divider ── */
hr {
    border-color: var(--border) !important;
}

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
</style>
""", unsafe_allow_html=True)

# ──────────────────────────────────────────────
# CONSTANTS
# ──────────────────────────────────────────────
KNOWN_DISEASES = ["All", "COVID-19", "Cancer", "Dengue", "Malaria", "Tuberculosis"]
REQUIRED_COLS  = {"drug", "smiles", "target", "binding_affinity", "disease"}

ACCENT  = "#00e5ff"
ACCENT2 = "#7b61ff"
ACCENT3 = "#00ff9d"
BG_DARK = "#080d14"
CARD    = "#111c2d"
BORDER  = "#1e3050"


# ──────────────────────────────────────────────
# PLOTLY THEME HELPER
# ──────────────────────────────────────────────
def dark_layout(fig: go.Figure, title: str = "") -> go.Figure:
    """Apply consistent dark theme to a Plotly figure."""
    fig.update_layout(
        title=dict(text=title, font=dict(family="Space Mono", size=14, color=ACCENT)),
        paper_bgcolor=CARD,
        plot_bgcolor="#0d1520",
        font=dict(family="DM Sans", color="#cdd9e8"),
        xaxis=dict(gridcolor=BORDER, zerolinecolor=BORDER, tickfont=dict(color="#5a7a9a")),
        yaxis=dict(gridcolor=BORDER, zerolinecolor=BORDER, tickfont=dict(color="#5a7a9a")),
        margin=dict(t=55, b=40, l=50, r=20),
        legend=dict(bgcolor="rgba(0,0,0,0)", bordercolor=BORDER, font=dict(color="#cdd9e8")),
    )
    return fig




# ──────────────────────────────────────────────
# VALIDATE UPLOADED DATAFRAME
# ──────────────────────────────────────────────
def validate(df: pd.DataFrame) -> tuple[bool, str]:
    missing = REQUIRED_COLS - set(df.columns.str.lower())
    if missing:
        return False, f"Missing columns: {', '.join(sorted(missing))}"
    return True, ""


# ──────────────────────────────────────────────
# HERO HEADER
# ──────────────────────────────────────────────
st.markdown("""
<div class="hero-banner">
    <div class="hero-title">🧬 AI-Driven Drug Discovery Platform</div>
    <div class="hero-sub">Drug Candidate Exploration Dashboard</div>
</div>
""", unsafe_allow_html=True)


# ──────────────────────────────────────────────
# SIDEBAR
# ──────────────────────────────────────────────
with st.sidebar:
    st.markdown('<div class="section-label">📂 Dataset</div>', unsafe_allow_html=True)
    uploaded = st.file_uploader(
        "Upload CSV",
        type=["csv"],
        help="Required columns: drug · smiles · target · binding_affinity · disease",
    )

    st.markdown("---")
    st.markdown('<div class="section-label">🔍 Filters</div>', unsafe_allow_html=True)

    disease_options = KNOWN_DISEASES.copy()
    selected_disease = st.selectbox("Disease", disease_options, index=0)

    drug_search = st.text_input("Drug name search", placeholder="e.g. Remdesivir")

    st.markdown("---")
    st.markdown('<div class="section-label">🧪 Target protein</div>', unsafe_allow_html=True)
    target_filter_placeholder = st.empty()   # filled after data loads


# ──────────────────────────────────────────────
# LOAD DATA
# ──────────────────────────────────────────────
if uploaded is not None:
    try:
        raw_df = pd.read_csv(uploaded)
        raw_df.columns = raw_df.columns.str.lower().str.strip()
        ok, msg = validate(raw_df)
        if not ok:
            st.error(f"⚠️ {msg}")
            st.stop()
        # Normalise types
        raw_df["binding_affinity"] = pd.to_numeric(raw_df["binding_affinity"], errors="coerce")
        raw_df.dropna(subset=["binding_affinity"], inplace=True)
        data_source = "uploaded"
    except Exception as e:
        st.error(f"Could not read file: {e}")
        st.stop()
else:
    st.info("Please upload a CSV dataset via the sidebar to get started.", icon="ℹ️")
    st.stop()

df = raw_df.copy()

# ── Target filter (dynamic after data loads) ──────────────
all_targets = sorted(df["target"].dropna().unique().tolist())
with target_filter_placeholder:
    selected_target = st.selectbox("Target protein", ["All"] + all_targets)


# ──────────────────────────────────────────────
# APPLY FILTERS
# ──────────────────────────────────────────────
filtered = df.copy()

if selected_disease != "All":
    filtered = filtered[filtered["disease"] == selected_disease]

if selected_target != "All":
    filtered = filtered[filtered["target"] == selected_target]

if drug_search.strip():
    filtered = filtered[
        filtered["drug"].str.contains(drug_search.strip(), case=False, na=False)
    ]



# ══════════════════════════════════════════════
# SECTION 1 — SUMMARY METRICS
# ══════════════════════════════════════════════
st.markdown('<div class="section-label">📊 Summary</div>', unsafe_allow_html=True)

m1, m2, m3, m4 = st.columns(4)
with m1:
    st.metric("Total Drugs",    len(df["drug"].dropna().unique()))
with m2:
    st.metric("Total Diseases", len(df["disease"].dropna().unique()))
with m3:
    st.metric("Total Targets",  len(df["target"].dropna().unique()))
with m4:
    avg_ba = df["binding_affinity"].mean()
    st.metric("Avg Binding Affinity", f"{avg_ba:.2f}" if not pd.isna(avg_ba) else "N/A")

st.markdown("---")


# ══════════════════════════════════════════════
# SECTION 2 — DATASET PREVIEW
# ══════════════════════════════════════════════
with st.expander("🗂️ Dataset Preview", expanded=True):
    st.markdown(
        f'<div class="section-label">Showing {len(filtered)} of {len(df)} records</div>',
        unsafe_allow_html=True,
    )
    st.dataframe(
        filtered.reset_index(drop=True),
        use_container_width=True,
        height=260,
    )


# ══════════════════════════════════════════════
# SECTION 3 — VISUALIZATIONS
# ══════════════════════════════════════════════
st.markdown('<div class="section-label">📈 Visualizations</div>', unsafe_allow_html=True)

col_left, col_right = st.columns(2)

# ── Bar: drugs per disease ───────────────────
with col_left:
    disease_counts = (
        df.groupby("disease")["drug"]
        .nunique()
        .reset_index()
        .rename(columns={"drug": "count"})
        .sort_values("count", ascending=False)
    )
    fig_bar = px.bar(
        disease_counts, x="disease", y="count",
        color="count",
        color_continuous_scale=[[0, "#1e3050"], [0.5, ACCENT2], [1, ACCENT]],
        labels={"disease": "Disease", "count": "# Unique Drugs"},
    )
    fig_bar.update_coloraxes(showscale=False)
    fig_bar = dark_layout(fig_bar, "Drugs per Disease")
    fig_bar.update_traces(marker_line_width=0)
    st.plotly_chart(fig_bar, use_container_width=True)

# ── Histogram: binding affinity ──────────────
with col_right:
    plot_df = filtered if not filtered.empty else df
    fig_hist = px.histogram(
        plot_df, x="binding_affinity",
        nbins=20,
        color_discrete_sequence=[ACCENT3],
        labels={"binding_affinity": "Binding Affinity"},
    )
    fig_hist = dark_layout(fig_hist, "Binding Affinity Distribution")
    fig_hist.update_traces(marker_line_color=BG_DARK, marker_line_width=.5)
    st.plotly_chart(fig_hist, use_container_width=True)

# ── Top target proteins ───────────────────────
target_counts = (
    filtered.groupby("target")["drug"]
    .count()
    .reset_index()
    .rename(columns={"drug": "count"})
    .sort_values("count", ascending=True)
    .tail(10)
)
if not target_counts.empty:
    fig_targets = px.bar(
        target_counts, x="count", y="target",
        orientation="h",
        color="count",
        color_continuous_scale=[[0, "#1e3050"], [0.5, ACCENT2], [1, ACCENT]],
        labels={"target": "Target Protein", "count": "Drug Count"},
    )
    fig_targets.update_coloraxes(showscale=False)
    fig_targets = dark_layout(
        fig_targets,
        f"Top Target Proteins — {selected_disease if selected_disease != 'All' else 'All Diseases'}",
    )
    fig_targets.update_traces(marker_line_width=0)
    st.plotly_chart(fig_targets, use_container_width=True)

st.markdown("---")


# ══════════════════════════════════════════════
# SECTION 4 — DRUG DETAILS PANEL
# ══════════════════════════════════════════════
st.markdown('<div class="section-label">💊 Drug Details</div>', unsafe_allow_html=True)

drug_list = sorted(filtered["drug"].dropna().unique().tolist())
if drug_list:
    selected_drug = st.selectbox("Select a drug to inspect", drug_list)
    drug_row = filtered[filtered["drug"] == selected_drug].iloc[0]

    d1, d2, d3, d4 = st.columns(4)
    def detail_card(col, label, value):
        with col:
            st.markdown(f"""
            <div class="drug-card">
                <div class="drug-field-label">{label}</div>
                <div class="drug-field-value">{value}</div>
            </div>""", unsafe_allow_html=True)

    detail_card(d1, "Drug Name",        drug_row["drug"])
    detail_card(d2, "Target Protein",   drug_row["target"])
    detail_card(d3, "Binding Affinity", f"{drug_row['binding_affinity']:.2f}")
    detail_card(d4, "Disease",          drug_row["disease"])

    with st.expander("🔬 SMILES String"):
        st.code(drug_row.get("smiles", "N/A"), language="text")
else:
    st.warning("No drugs match the current filters.")

st.markdown("---")


# ══════════════════════════════════════════════
# SECTION 5 — AI COMING SOON
# ══════════════════════════════════════════════
st.markdown("""
<div class="ai-banner">
    <div class="badge">COMING SOON</div>
    <div class="ai-banner-title">🤖 AI Drug Prediction (Coming Soon)</div>
    <div class="ai-banner-body">
        Future versions of this platform will integrate deep learning models to predict
        novel drug candidates based on molecular fingerprints, target protein structures,
        and known binding affinities.<br><br>
        Planned capabilities include:<br>
        &nbsp;· <strong>GNN-based binding affinity prediction</strong> from SMILES strings<br>
        &nbsp;· <strong>Virtual screening</strong> of large molecular libraries<br>
        &nbsp;· <strong>ADMET property prediction</strong> (Absorption, Distribution, Metabolism, Excretion, Toxicity)<br>
        &nbsp;· <strong>De-novo molecule generation</strong> with reinforcement learning<br><br>
        Stay tuned for model integration in the next release.
    </div>
</div>
""", unsafe_allow_html=True)

# ──────────────────────────────────────────────
# FOOTER
# ──────────────────────────────────────────────
st.markdown("""
<hr style="margin-top:2.5rem"/>
<div style="text-align:center;color:#2a4060;font-size:.75rem;font-family:'Space Mono',monospace;padding-bottom:1rem;">
    AI-Driven Drug Discovery Platform · Built with Streamlit · © 2025
</div>
""", unsafe_allow_html=True)
