"use client";
import {useMemo,useState} from 'react';
import {ChevronLeft,ChevronRight,MoreHorizontal,Trash2} from 'lucide-react';
import './DataTable.css';

export default function DataTable({columns,rows,pageSize=10,onView,onMenu,onDelete,rowClassName,emptyText='No records found.'}){
 const[page,setPage]=useState(1);
 const totalPages=Math.max(1,Math.ceil(rows.length/pageSize));
 const safePage=Math.min(page,totalPages);
 const paged=useMemo(()=>rows.slice((safePage-1)*pageSize,safePage*pageSize),[rows,pageSize,safePage]);
 const hasActions=Boolean(onView||onMenu||onDelete);
 return <div className="data-table-shell"><div className="data-table-wrap"><table className="data-table"><thead><tr>{columns.map(c=><th key={c.key}>{c.label}</th>)}{hasActions&&<th>Action</th>}</tr></thead><tbody>{paged.length?paged.map((r,i)=><tr className={rowClassName?.(r)||''} key={r.id||r.name||i} onDoubleClick={()=>onView?.(r)}>{columns.map(c=><td data-label={c.label} key={c.key}>{c.render?c.render(r[c.key],r):r[c.key]}</td>)}{hasActions&&<td data-label="Action"><div className="row-actions">{onView&&<button type="button" className="table-action" onClick={()=>onView(r)}>View</button>}{onMenu&&<button type="button" className="dots" onClick={()=>onMenu(r)} aria-label={`More actions for ${r.name||r.id||'record'}`}><MoreHorizontal/></button>}{onDelete&&<button type="button" className="table-delete" onClick={()=>onDelete(r)} aria-label={`Delete ${r.name||r.title||r.receipt||r.id||'record'}`} title="Delete"><Trash2/></button>}</div></td>}</tr>):<tr className="empty-row"><td colSpan={columns.length+(hasActions?1:0)}><div className="table-empty">{emptyText}</div></td></tr>}</tbody></table></div>{rows.length>pageSize&&<div className="table-footer"><span>Showing {(safePage-1)*pageSize+1}–{Math.min(safePage*pageSize,rows.length)} of {rows.length}</span><div><button type="button" disabled={safePage===1} onClick={()=>setPage(p=>Math.max(1,p-1))} aria-label="Previous page"><ChevronLeft/></button><b>{safePage} / {totalPages}</b><button type="button" disabled={safePage===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} aria-label="Next page"><ChevronRight/></button></div></div>}</div>
}
