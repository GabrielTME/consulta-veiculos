const el = id => document.getElementById(id);
const f = id => el(id).value.trim();
const v = id => el(id).checked;
const toggleVis = (id, cond, dType = 'block') => el(id).style.display = cond ? dType : 'none';

let lastHasDebitos = false;

document.addEventListener('input', e => {
  if (e.target.matches('input[type="text"], input[type="number"]') && e.target.id !== 'modeloAno') {
    if (e.target.value.startsWith(' ')) e.target.value = e.target.value.trimStart();
  }
});

document.addEventListener('focusout', e => {
  if (e.target.matches('input[type="text"], input[type="number"]') && e.target.id !== 'modeloAno') {
    if (e.target.value !== e.target.value.trim()) {
      e.target.value = e.target.value.trim();
      atualizarPreview();
    }
  }
});

const UF_NOMES = {'AC':'Acre','AL':'Alagoas','AP':'Amapá','AM':'Amazonas','BA':'Bahia','CE':'Ceará','DF':'Distrito Federal','ES':'Espírito Santo','GO':'Goiás','MA':'Maranhão','MT':'Mato Grosso','MS':'Mato Grosso do Sul','MG':'Minas Gerais','PA':'Pará','PB':'Paraíba','PR':'Paraná','PE':'Pernambuco','PI':'Piauí','RJ':'Rio de Janeiro','RN':'Rio Grande do Norte','RS':'Rio Grande do Sul','RO':'Rondônia','RR':'Roraima','SP':'São Paulo','SE':'Sergipe','TO':'Tocantins'};
const BANCOS = ["Ailos","Aymoré","Bradesco","C6","Creditas","Cresol","Daycoval","Digimais","do Brasil","HS Consórcios","Itaucard","Omni","PAN","Safra","Sicoob","Sicredi","Volkswagen","Votorantim"].sort();
const MARCAS = ["Audi", "BMW", "BYD", "Chana", "Chery", "Chevrolet", "Citroën", "Dafra", "Effa", "Fiat", "Ford", "GWM", "Honda", "Hyundai", "Iveco", "JAC", "Jaguar", "Jeep", "Kawasaki", "Kia", "Land Rover", "Mahindra", "Mercedes-Benz", "Mitsubishi", "Nissan", "Peugeot", "Ram", "Reboque", "Renault", "Scania", "Shineray", "Ssangyong", "Sundown", "Suzuki", "Toyota", "Volkswagen", "Volvo", "Yamaha"].sort();

const RENAJUD_OPCOES = [
  {val:"transferência", label:"RENAJUD de Transferência"},
  {val:"licenciamento", label:"RENAJUD de Licenciamento"},
  {val:"circulação", label:"RENAJUD de Circulação"},
  {val:"penhora", label:"RENAJUD de Penhora"},
  {val:"execucao-certidao", label:"Execução por certidão"},
  {val:"administrativa", label:"Administrativa"},
  {val:"averbacao", label:"Averbação"}
];

function atualizarDropdownHistorico() {
  const sel = el('historicoSelect');
  sel.innerHTML = '<option value=""></option>';
  const hist = JSON.parse(localStorage.getItem('histConsultas') || '[]');
  hist.forEach((h, idx) => {
    sel.add(new Option(`${h.placa} - ${h.modeloAno}`, idx));
  });
}

function salvarHistorico() {
  const placa = f('placa');
  if (!placa) return;

  let hist = JSON.parse(localStorage.getItem('histConsultas') || '[]');
  hist = hist.filter(h => h.placa !== placa);

  const estado = {
    placa,
    marca: f('marca'),
    modeloAno: f('modeloAno'),
    proprietario: f('proprietario'),
    proprietarioCnpj: v('proprietarioCnpj'),
    emplacadoEm: f('emplacadoEm'),
    municipioEstado: f('municipioEstado'),
    temAnterior: v('temAnterior'),
    emplacadoAnterior: f('emplacadoAnterior'),
    temFinanciamento: v('temFinanciamento'),
    financiamentoIncluso: v('financiamentoIncluso'),
    financiamentoSelect: f('financiamentoSelect'),
    financiamentoInfo: f('financiamentoInfo'),
    dataContrato: f('dataContrato'),
    temRenajud: v('temRenajud'),
    renajuds: Array.from(document.querySelectorAll('.renajud-item')).map(div => ({
      val: div.querySelector('.selRenajud').value,
      qtd: div.querySelector('.qtdRenajud').value
    })),
    temIntencao: v('temIntencao'),
    temComunicacao: v('temComunicacao'),
    nomeIntencao: f('nomeIntencao'),
    nomeIntencaoCnpj: v('nomeIntencaoCnpj'),
    dataInclusaoIntencao: f('dataInclusaoIntencao'),
    temObservacao: v('temObservacao'),
    observacoes: Array.from(document.querySelectorAll('.textoObservacao')).map(i => i.value),
    dia25: v('dia25'),
    dia26: v('dia26'),
    ipvaLic: v('ipvaLic'),
    debitos: Array.from(document.querySelectorAll('.descricaoDebito')).map(i => i.value),
    chkEmissao: v('chkEmissao'),
    debitoValor: f('debitoValor'),
    temMultasAutuac: v('temMultasAutuac'),
    quantidadeMultas: f('quantidadeMultas'),
    valorMultas: f('valorMultas'),
    temMultasRecor: v('temMultasRecor'),
    quantidadeMultasRecor: f('quantidadeMultasRecor'),
    valorMultasRecor: f('valorMultasRecor'),
    temAvisoSP: v('temAvisoSP'),
    temAvisoRS: v('temAvisoRS')
  };

  hist.unshift(estado);
  if (hist.length > 5) hist.pop();

  localStorage.setItem('histConsultas', JSON.stringify(hist));
  atualizarDropdownHistorico();
}

function carregarHistorico(idx) {
  if (idx === '') return;
  const hist = JSON.parse(localStorage.getItem('histConsultas') || '[]');
  const h = hist[idx];
  if (!h) return;

  const setVal = (id, val) => { if(el(id)) el(id).value = val || ''; };
  const setChk = (id, checked) => { if(el(id)) el(id).checked = checked || false; };

  setVal('placa', h.placa);
  setVal('marca', h.marca);
  setVal('modeloAno', h.modeloAno);
  setVal('proprietario', h.proprietario);
  setChk('proprietarioCnpj', h.proprietarioCnpj);
  setVal('emplacadoEm', h.emplacadoEm);
  setVal('municipioEstado', h.municipioEstado);
  setChk('temAnterior', h.temAnterior);
  setVal('emplacadoAnterior', h.emplacadoAnterior);
  setChk('temFinanciamento', h.temFinanciamento);
  setChk('financiamentoIncluso', h.financiamentoIncluso);
  setVal('financiamentoSelect', h.financiamentoSelect);
  setVal('financiamentoInfo', h.financiamentoInfo);
  setVal('dataContrato', h.dataContrato);
  
  setChk('temRenajud', h.temRenajud);
  el('renajudContainer').innerHTML = '';
  if (h.renajuds && h.renajuds.length > 0) {
    h.renajuds.forEach(r => {
      adicionarRenajud();
      const divs = document.querySelectorAll('.renajud-item');
      const lastDiv = divs[divs.length - 1];
      lastDiv.querySelector('.selRenajud').value = r.val;
      lastDiv.querySelector('.qtdRenajud').value = r.qtd;
    });
  } else {
    adicionarRenajud();
  }

  setChk('temIntencao', h.temIntencao);
  setChk('temComunicacao', h.temComunicacao);
  setVal('nomeIntencao', h.nomeIntencao);
  setChk('nomeIntencaoCnpj', h.nomeIntencaoCnpj);
  setVal('dataInclusaoIntencao', h.dataInclusaoIntencao);

  setChk('temObservacao', h.temObservacao);
  el('observacoesContainer').innerHTML = '';
  if (h.observacoes && h.observacoes.length > 0) {
    h.observacoes.forEach(obs => {
      adicionarObservacao();
      const inputs = document.querySelectorAll('.textoObservacao');
      inputs[inputs.length - 1].value = obs;
    });
  } else {
    adicionarObservacao();
  }

  setChk('dia25', h.dia25);
  setChk('dia26', h.dia26);
  setChk('ipvaLic', h.ipvaLic);
  
  el('debitosContainer').innerHTML = '';
  let loadedHasDebitos = false;
  if (h.debitos && h.debitos.length > 0) {
    h.debitos.forEach(deb => {
      adicionarDebito();
      const inputs = document.querySelectorAll('.descricaoDebito');
      inputs[inputs.length - 1].value = deb;
      if (deb.trim() !== '') loadedHasDebitos = true;
    });
  } else {
    for(let i=0; i<3; i++) adicionarDebito();
  }
  lastHasDebitos = loadedHasDebitos;

  setChk('chkEmissao', h.chkEmissao !== false);
  setVal('debitoValor', h.debitoValor);

  setChk('temMultasAutuac', h.temMultasAutuac);
  setVal('quantidadeMultas', h.quantidadeMultas);
  setVal('valorMultas', h.valorMultas);

  setChk('temMultasRecor', h.temMultasRecor);
  setVal('quantidadeMultasRecor', h.quantidadeMultasRecor);
  setVal('valorMultasRecor', h.valorMultasRecor);

  setChk('temAvisoSP', h.temAvisoSP);
  setChk('temAvisoRS', h.temAvisoRS);

  atualizarPreview();
  el('historicoSelect').selectedIndex = 0;
}

function onInputPlaca(e) { 
  e.target.value = e.target.value.toUpperCase(); 
  atualizarPreview(); 
}

function onInputData(e) {
  let val = e.target.value.replace(/\D/g, '').substring(0, 8);
  if (val.length >= 5) val = `${val.substring(0,2)}/${val.substring(2,4)}/${val.substring(4)}`;
  else if (val.length >= 3) val = `${val.substring(0,2)}/${val.substring(2)}`;
  e.target.value = val; 
  atualizarPreview();
}

function onInputCapitalize(e) {
  const start = e.target.selectionStart;
  const isSimple = e.target.id === 'emplacadoEm';
  const dWords = ['de', 'da', 'do', 'das', 'dos'];
  let texto = e.target.value.toLowerCase().replace(/(?:^|\s|[.])[a-zà-ú]/g, m => m.toUpperCase())
                            .replace(/\b([Dd][aeo]s?)\b/g, m => dWords.includes(m.toLowerCase()) ? m.toLowerCase() : m);
  
  if (!isSimple) texto = texto.replace(/\bltda\b/gi, 'LTDA').replace(/\bme\b/gi, 'ME').replace(/\bE\b/g, 'e');
  
  if (e.target.value !== texto) { 
    e.target.value = texto; 
    e.target.setSelectionRange(start, start); 
  }
  atualizarPreview();
}

function handleDiasChange() {
  if (v('dia25') || v('dia26')) {
    el('chkEmissao').checked = false;
  }
}

function toggleIpvaLic() {
  const isChecked = v('ipvaLic');
  while (document.querySelectorAll('.descricaoDebito').length < 2) adicionarDebito();
  const inputs = document.querySelectorAll('.descricaoDebito');
  
  if (isChecked) {
    inputs[0].value = "Licenciamento 2026";
    inputs[1].value = "IPVA 2026";
  } else {
    if (inputs[0].value === "Licenciamento 2026") inputs[0].value = "";
    if (inputs[1].value === "IPVA 2026") inputs[1].value = "";
  }
  atualizarPreview();
}

function popularDropdowns() {
  const selAnterior = el('emplacadoAnterior'), selMunicipio = el('municipioEstado'), selBanco = el('financiamentoSelect'), selMarca = el('marca');
  
  if (selAnterior.options.length <= 1) {
    Object.keys(UF_NOMES).sort().forEach(s => {
      if (s !== 'SC') { selAnterior.add(new Option(s, s)); selMunicipio.add(new Option(s, s)); }
    });
  }
  if (selBanco.options.length <= 1) BANCOS.forEach(b => selBanco.add(new Option(b === "do Brasil" ? "Banco do Brasil" : b, b)));
  if (selMarca.options.length <= 1) MARCAS.forEach(m => selMarca.add(new Option(m, m)));
}

function adicionarDebito() {
  const div = document.createElement('div'); 
  div.className = 'row-item';
  const input = document.createElement('input'); 
  input.type = 'text'; input.className = 'descricaoDebito'; 
  input.addEventListener('input', atualizarPreview);
  div.appendChild(input);
  el('debitosContainer').appendChild(div);
}

function adicionarObservacao() {
  const input = document.createElement('input'); 
  input.type = 'text'; input.className = 'textoObservacao'; input.style.marginBottom = '8px'; 
  input.addEventListener('input', atualizarPreview);
  el('observacoesContainer').appendChild(input);
}

function adicionarRenajud() {
  const div = document.createElement('div');
  div.className = 'renajud-item'; div.style.cssText = 'display:flex; gap:6px; margin-bottom:8px;';

  const sel = document.createElement('select'); 
  sel.className = 'selRenajud'; sel.style.flex = '1';
  sel.addEventListener('change', atualizarPreview);
  RENAJUD_OPCOES.forEach(o => sel.add(new Option(o.label, o.val)));

  const qtd = document.createElement('input');
  qtd.type = 'number'; qtd.className = 'qtdRenajud'; qtd.min = '1'; qtd.value = '1'; qtd.style.width = '60px';
  qtd.addEventListener('input', atualizarPreview);

  div.append(sel, qtd);
  el('renajudContainer').appendChild(div);
  atualizarPreview();
}

function adicionar200() {
  let val = getFloat(f('debitoValor'));
  val += 200;
  el('debitoValor').value = formatStrVal(val);
  atualizarPreview();
}

const formatStrVal = num => `R$${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const getFloat = str => parseFloat(str.replace(/[^\d,]/g, '').replace(',', '.')) || 0;

function gerarTextoMensagem() {
  const placa = f('placa'), marca = f('marca'), modeloAno = f('modeloAno'), mun = f('emplacadoEm'), ufMun = f('municipioEstado');
  const empAnt = v('temAnterior') ? f('emplacadoAnterior') : '', prop = f('proprietario'), propCnpj = v('proprietarioCnpj');
  const finan = v('temFinanciamento') ? f('financiamentoInfo') : '', finanInc = v('financiamentoIncluso'), dataCont = f('dataContrato');
  
  let msg = `🚗 *DADOS DO VEÍCULO*\n`;
  if (placa) msg += `• *Placa:* ${placa}\n`;
  const modeloStr = `${marca} ${modeloAno}`.trim();
  if (modeloStr) msg += `• *Modelo:* ${modeloStr}\n`;
  if (prop) msg += `• *Proprietário:* ${prop}${propCnpj ? ' (CNPJ)' : ''}\n`;
  if (mun) msg += `• *Município:* ${mun}${ufMun ? ` - ${ufMun}` : ''}${empAnt ? ` (Procedência anterior: ${UF_NOMES[empAnt] || empAnt})` : ''}\n`;

  msg += `\n⚠️ *RESTRIÇÕES E PENDÊNCIAS*\n`;
  msg += `• *Alienação:* ${finan ? `Possui financiamento ${finanInc ? 'a ser incluído' : 'ativo'} (${finan === 'do Brasil' ? '*Banco do Brasil*' : `Banco *${finan}*`}${dataCont ? `, contrato de ${dataCont}` : ''})` : 'Não possui'}\n`;

  const needsEmoji = ["transferência", "licenciamento", "circulação", "penhora", "administrativa"];
  const renList = Array.from(document.querySelectorAll('.renajud-item')).map(div => {
    const val = div.querySelector('.selRenajud').value, qtd = parseInt(div.querySelector('.qtdRenajud').value) || 1;
    const label = RENAJUD_OPCOES.find(o => o.val === val).label.toLowerCase();
    let desc = label;
    
    if (["transferência", "licenciamento", "circulação", "penhora"].includes(val)) desc = `${qtd > 1 ? `${qtd} bloqueios` : 'bloqueio'} RENAJUD de ${val}`;
    else if (val === "execucao-certidao") desc = `${qtd > 1 ? `${qtd} restrições` : 'restrição'} de execução por certidão`;
    else if (val === "administrativa") desc = `${qtd > 1 ? `${qtd} restrições administrativas` : 'restrição administrativa'}`;
    else if (val === "averbacao") desc = `${qtd > 1 ? `${qtd} averbações` : 'averbação'} de execução por certidão`;
    
    return { desc: desc.charAt(0).toUpperCase() + desc.slice(1), emoji: needsEmoji.includes(val) ? ' 🚫' : '' };
  });

  if (!v('temRenajud') || renList.length === 0) {
    msg += `• *Restrição:* Não possui\n`;
  } else if (renList.length === 1) {
    msg += `• *Restrição:* Possui ${renList[0].desc.charAt(0).toLowerCase() + renList[0].desc.slice(1)}${renList[0].emoji}\n`;
  } else {
    msg += `• *Restrição:* Possui:\n${renList.map(r => `• ${r.desc}${r.emoji}`).join('\n')}\n`;
  }

  const nomeInt = f('nomeIntencao'), dataInt = f('dataInclusaoIntencao'), intCnpj = v('nomeIntencaoCnpj');
  if ((v('temIntencao') || v('temComunicacao')) && nomeInt) {
    const prefix = v('temIntencao') && v('temComunicacao') ? "Intenção e comunicação" : (v('temIntencao') ? "Intenção" : "Comunicação");
    msg += `• *Venda:* ${prefix} de venda registrada para ${nomeInt}${intCnpj ? ' (CNPJ)' : ''}${dataInt ? ` em ${dataInt}` : ''}\n`;
  } else {
    msg += `• *Venda:* Não possui\n`;
  }

  const obsArr = Array.from(document.querySelectorAll('.textoObservacao')).map(i => i.value.trim()).filter(Boolean);
  if (v('temObservacao') && obsArr.length > 0) msg += `\n🔍 *OBSERVAÇÕES*\n${obsArr.map(o => `• ${o}`).join('\n')}\n`;

  msg += `\n💰 *DÉBITOS*\n`;
  const d25 = v('dia25');
  const d26 = v('dia26');

  const debs = Array.from(document.querySelectorAll('.descricaoDebito')).map(i => i.value.trim()).filter(Boolean);
  if (v('chkEmissao')) debs.push('Emissão');

  const valTot = el('debitoValor').value.includes('R$') ? f('debitoValor') : formatStrVal(getFloat(f('debitoValor')));

  if (debs.length > 0) {
    if (d25) msg += `• Veículo em dia (2025)\n`;
    if (d26) msg += `• Veículo em dia (2026)\n`;
    debs.forEach((d, i) => msg += `• ${d}${i === debs.length - 1 ? ' =' : ' +'}\n`);
  } else {
    if (d25) {
      msg += `• Sem débitos, veículo em dia (2025)\n`;
    } else if (d26) {
      msg += `• Sem débitos, veículo em dia (2026)\n`;
    } else {
      msg += `• Sem débitos, veículo em dia (2026)\n`;
    }
  }

  if (debs.length > 0 || (!v('dia25') && !v('dia26'))) {
    if (getFloat(valTot) > 0) msg += `• *VALOR TOTAL:* ${valTot}\n`;
  }

  const qtdMul = parseInt(f('quantidadeMultas') || '0');
  let hasAutuac = false;
  if (v('temMultasAutuac') && qtdMul > 0) {
    hasAutuac = true;
    msg += `\n• ${qtdMul === 1 ? '1 multa que ainda não caiu no sistema' : `${qtdMul} multas que ainda não caíram no sistema`}${getFloat(f('valorMultas')) > 0 ? ` (valor total de ${formatStrVal(getFloat(f('valorMultas')))})` : ''}\n`;
  }

  const qtdMulRec = parseInt(f('quantidadeMultasRecor') || '0');
  if (v('temMultasRecor') && qtdMulRec > 0) {
    if (!hasAutuac) msg += `\n`;
    msg += `• ${qtdMulRec === 1 ? '1 multa sendo recorrida' : `${qtdMulRec} multas sendo recorridas`}${getFloat(f('valorMultasRecor')) > 0 ? ` (valor total de ${formatStrVal(getFloat(f('valorMultasRecor')))})` : ''}\n`;
  }
  
  if (v('temAvisoSP')) msg += `\n⚠️ *O Detran de SP pode conter informações desatualizadas*`;
  if (v('temAvisoRS')) msg += `\n⚠️ *O Detran do RS pode conter informações desatualizadas*`;

  return msg.trim();
}

function atualizarPreview() {
  if (document.activeElement.id === 'previewMsg') return;

  const currentDebitos = Array.from(document.querySelectorAll('.descricaoDebito')).map(i => i.value.trim()).filter(Boolean);
  const hasDebitos = currentDebitos.length > 0;
  
  if (hasDebitos && !lastHasDebitos) {
    el('chkEmissao').checked = true;
  } else if (!hasDebitos && lastHasDebitos) {
    el('chkEmissao').checked = false;
  }
  lastHasDebitos = hasDebitos;

  el('previewMsg').innerHTML = gerarTextoMensagem().replace(/\*([^\*]+)\*/g, '<b>$1</b>');
  
  toggleVis('emplacadoAnterior', v('temAnterior'));
  toggleVis('financiamentoCampos', v('temFinanciamento'), 'flex');
  const showVenda = v('temIntencao') || v('temComunicacao');
  toggleVis('vendaCampos', showVenda);
  toggleVis('observacoesContainer', v('temObservacao'), 'flex');
  toggleVis('btnMaisObs', v('temObservacao'), 'flex');
  toggleVis('renajudContainer', v('temRenajud'));
  toggleVis('btnMaisRenajud', v('temRenajud'));
  toggleVis('multasAutuacCampos', v('temMultasAutuac'), 'flex');
  toggleVis('multasRecorCampos', v('temMultasRecor'), 'flex');
}

function copiarMensagem() { 
  salvarHistorico();
  const temp = document.createElement('div');
  temp.innerHTML = el('previewMsg').innerHTML
    .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '*$1*')
    .replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '\n$1')
    .replace(/<br\s*\/?>/gi, '\n');
  
  navigator.clipboard.writeText(temp.innerText.trim()).then(() => {
    const btn = el('btnCopiarMsg');
    btn.classList.add('success');
    btn.innerText = '✓ Copiado';
    setTimeout(() => { btn.classList.remove('success'); btn.innerText = 'Copiar'; }, 1500);
  }); 
}

function limparCampos() {
  document.querySelectorAll('input[type="text"]:not([readonly]), input[type="number"]').forEach(i => i.value = '');
  document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
  document.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
  
  el('debitosContainer').innerHTML = ''; el('observacoesContainer').innerHTML = ''; el('renajudContainer').innerHTML = '';
  for(let i=0; i<3; i++) adicionarDebito();
  adicionarObservacao(); adicionarRenajud(); popularDropdowns(); 
  
  lastHasDebitos = false;
  atualizarPreview();
}

window.onload = () => {
  popularDropdowns();
  atualizarDropdownHistorico();
  for(let i=0; i<3; i++) adicionarDebito();
  adicionarObservacao(); adicionarRenajud();
  
  document.querySelectorAll('input[type="text"]').forEach(i => {
    const ignore = ['placa','marca','modeloAno','financiamentoInfo','debitoValor','dataInclusaoIntencao','dataContrato','emplacadoEm','proprietario','nomeIntencao','quantidadeMultas','valorMultas','quantidadeMultasRecor','valorMultasRecor'];
    if (!ignore.includes(i.id)) {
      i.addEventListener('input', e => {
        e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
        atualizarPreview();
      });
    }
  });
  atualizarPreview();
};
