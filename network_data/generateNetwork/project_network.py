# -*- coding: utf-8 -*-
"""
Created on Mon Jul 25 14:19:02 2022

@author: sophi

building trial network

"""

#%% Import required packages

import os
import pandas as pd
#from unidecode import unidecode
import re
import networkx as nx
import matplotlib.pyplot as plt
#from matplotlib.pyplot import text
import numpy as np
from itertools import product

os.chdir(r"C:\Users\sophi\Documents\1 WORK\Galapagos\Co-Galapagos\Project network")

#%% Prep data

data="PROJECT_NETWORK.xlsx"

projs = pd.read_excel (data,sheet_name='MAIN',engine='openpyxl')
#projs = projs.iloc[:1] #if viewing a sample
#projs.drop(["Start_date","End_date","Title_ES","Title_EN","Nickname_EN","Summary_ES","Summary_EN","Link"],axis=1,inplace=True)

#Remove accents
#projs.Lead_person = projs.Lead_person.astype(str).apply(unidecode)
#projs.Nickname_ES = projs.Nickname_ES.astype(str).apply(unidecode)

#%% Add all years
#Create stack for years
years = projs.copy()[["Code","Date_start","Date_end"]]
years['Year_start'] = pd.DatetimeIndex(years['Date_start']).year
years['Year_end'] = pd.DatetimeIndex(years['Date_end']).year
years.Year_end = years.Year_end. fillna(2023)
years.Year_start = years.Year_start.astype(int)
years.Year_end = years.Year_end.astype(int)

years['Years']=""
for i in range(0,len(years)):
    years['Years'][i]=list(range(years['Year_start'][i],years['Year_end'][i]+1,1))

years_list=[]
for i in range(0,len(years)):
    years_list.append(list(product([years['Code'][i]],years['Years'][i])))

years = pd.DataFrame([item for sublist in years_list for item in sublist])
years["Weight"]=1      
years.columns=["Code","Year","Weight"]

#Create list of all years
AllYears = list(years['Year'].unique())
AllYears.sort()

#Put all featured years as columns on the basal dataframe
for x in range(len(AllYears)):
    projs=pd.concat([projs,pd.DataFrame({AllYears[x]: 0},index=range(len(projs)))],axis=1).copy()

#Fill in basal dataframe    
for y in range(len(years)):
    projs.loc[
        projs['Code'] == years['Code'][y], #row
        years['Year'][y]]=1 #column

#%% Add all leaders, additional leads and collaborators

other_leaders = pd.read_excel(data,sheet_name="other_leaders",engine='openpyxl')
collab_people = pd.read_excel(data,sheet_name="collaborators",engine='openpyxl')

#Make list of all unique names
all_other_people = projs.Leader.tolist() + other_leaders.Name.tolist() + collab_people.Name.tolist()
all_other_people = list(set(all_other_people))
all_other_people.sort()

#Put all featured people as columns on the basal dataframe
for x in range(len(all_other_people)):
    projs=pd.concat([projs,pd.DataFrame({all_other_people[x]: 0},index=range(len(projs)))],axis=1).copy()

#Fill in basal dataframe
for y in range(len(projs)):
    projs.loc[
        y, #row
        projs.Leader[y]]=2 #column
    
for y in range(len(other_leaders)):
    projs.loc[
        projs['Code'] == other_leaders['Code'][y], #row
        other_leaders.Name[y]]=2 #column
    
for y in range(len(collab_people)):
    projs.loc[
        projs['Code'] == collab_people['Code'][y], #row
        collab_people.Name[y]]=1 #column
    
#%% Add all lead orgs, additional lead orgs and collaborating orgs

orgs = pd.read_excel(data,sheet_name="orgs_funders (all)",engine='openpyxl')

#Make list of all orgs (from collab people and collab orgs)
AllOrgs = orgs.Org.unique().tolist()
AllOrgs = list(set(AllOrgs)) 
AllOrgs.sort()

#Put all featured orgs as columns on the basal dataframe
for x in range(len(AllOrgs)):
    projs=pd.concat([projs,pd.DataFrame({AllOrgs[x]: 0},index=range(len(projs)))],axis=1).copy()

#Fill in basal dataframe with collab orgs
for y in range(len(orgs.Org)):
    projs.loc[
        projs['Code'] == orgs['Code'][y], #row
        orgs.Org[y]]=1 #column

#Overwrite weight of lead orgs
for y in range(len(projs)):
    projs.loc[
        y, #row
        projs.Lead_org[y]]=2 #column

#Overwrite weight of additional lead orgs    
for y in range(len(other_leaders)):
    projs.loc[
        projs['Code'] == other_leaders['Code'][y], #row
        other_leaders.Org[y]]=2 #column

projs.drop(np.nan,axis=1, inplace=True)

#%% Add islands

islands = pd.read_excel(data,sheet_name="islands",engine='openpyxl')

#Create list of all islands
AllIslands = list(islands['Island'].unique())
AllIslands.sort()

#Put all featured islands as columns on the basal dataframe
for x in range(len(AllIslands)):
    projs=pd.concat([projs,pd.DataFrame({AllIslands[x]: 0},index=range(len(projs)))],axis=1).copy()

#Fill in basal dataframe    
for y in range(len(islands)):
    projs.loc[
        projs['Code'] == islands['Code'][y], #row
        islands['Island'][y]]=1 #column
    
#%% Add species

species = pd.read_excel(data,sheet_name="species",engine='openpyxl')

#Create list of all species
AllSpecies = list(species['Species'].unique())
AllSpecies.sort()

#Put all featured species as columns on the basal dataframe
for x in range(len(AllSpecies)):
    projs=pd.concat([projs,pd.DataFrame({AllSpecies[x]: 0},index=range(len(projs)))],axis=1).copy()

#Fill in basal dataframe    
for y in range(len(species)):
    projs.loc[
        projs['Code'] == species['Code'][y], #row
        species['Species'][y]]=1 #column

#%% Add keywords

keywords = pd.read_excel(data,sheet_name="keywords",engine='openpyxl')
AllKeywords = {}

#Process one set at a time
keywords2=keywords.dropna(axis=1,how="all")
for col in keywords2.columns[5:]:
    x = int(re.findall(r'\d+', col)[0])
    keywords3=keywords2['Theme'+str(x)+"_keywords"].str.split(", ",expand=True)
    #keywords3=keywords3.apply(lambda a: a.str.strip('"'),axis=1) #strips trailing ""
    #keywords3=keywords3.apply(lambda a: a.str.strip(' '),axis=1) #strips trailing space
    keywords3=keywords3.apply(lambda a: a.str.replace('\u200b',''),axis=1) #removes unprintable character
    keywords3=keywords3.rename(index=keywords["Code"])

    #stack
    keywords4=pd.DataFrame(keywords3.stack())
    keywords4.reset_index(level=1, inplace=True)
    keywords4.reset_index(level=0, inplace=True)
    keywords4=keywords4.drop("level_1",axis=1)
    keywords4.columns=["Code","keyword"]

    keys = list(keywords4['keyword'].unique())
    keys.sort()
    AllKeywords['Theme'+str(x)+"_keywords"]=keys 
    
    #Put all featured keywords as columns on the basal dataframe
    for x in range(len(keys)):
        projs=pd.concat([projs,pd.DataFrame({keys[x]: 0},index=range(len(projs)))],axis=1).copy()

    #Fill in basal dataframe    
    for y in range(len(keywords4)):
        projs.loc[
            projs['Code'] == keywords4['Code'][y], #row
            keywords4['keyword'][y]]=1 #column

#%% Add SDGs

SDGs = pd.read_excel(data,sheet_name="SDGs",engine='openpyxl',header=0)
SDGs.drop(["RedDeProyectosDeGalapagos_Id","Sección2InformaciónSobreSusProy_Id"],axis=1,inplace=True)
SDGs = pd.concat([SDGs.iloc[:,:1], SDGs.iloc[:,1:].replace(["I", "D"], [0.5, 1])], axis=1)

projs = pd.merge(projs,SDGs, on="Code",how = "left")    

del col,x,y

#%% Prepare network
projs = projs.loc[:, (projs != 0).any(axis=0)] #delete empty columns (for viewing sample)
G = nx.DiGraph()

#all nodes
G.add_nodes_from(projs.Nickname_ES)
G.add_nodes_from(projs.columns[15:])
#G.add_nodes_from(projs.columns[15:100]) #to view a sample

#project edges
Locs = [6]+list(range(15,len(projs.columns)))
#Locs = [6]+list(range(15,100))#to view a sample
projs_stack = pd.DataFrame(projs.iloc[:,Locs].set_index("Nickname_ES").stack())
projs_stack.reset_index(level=1, inplace=True)
projs_stack.reset_index(level=0, inplace=True)
projs_stack.columns=["proj","node","weight"]
projs_stack = projs_stack[projs_stack.weight != 0]
projs_stack.reset_index(inplace=True,drop=True)

e = projs_stack.apply(tuple, axis=1)
e = [[u,v,{'weight': d}] for [u,v,d] in e]
G.add_edges_from(e)

#add org-country edges
countries = pd.read_excel (data,sheet_name='ORGS FULL',engine='openpyxl')
countries = countries[["Org","Country"]]
countries["weight"]=1      
countries.columns=["org","node","weight"]

e = countries.apply(tuple, axis=1)
e = [[u,v,{'weight': d}] for [u,v,d] in e]
e = [[u,v,d] for [u,v,d] in e if u in projs.columns] #for viewing sample
G.add_edges_from(e)

#%% prep colours

#orgs_info = pd.read_excel(data,sheet_name="orgs_info",engine='openpyxl')

colors={}
for [u,v] in list(G.nodes(data=True)):
    if u in list(projs.Nickname_ES): 
        colors[u]="#B71C1C" 
    if u in AllYears: 
        colors[u]="#FDD835" 
    if u in list(projs.Leader) or u in list(other_leaders.Name) or u in list(collab_people.Name): 
        colors[u]="#4A148C"
    if u in AllOrgs: 
        colors[u]="#006064"
    # if u in list(orgs_info.Org[orgs_info.Funder=="Y"]): 
    #     colors[u]="#494847"
    if u in AllSpecies: 
        colors[u]="#F57F17"
    if u in AllIslands: 
        colors[u]="#33691E"
    if u in list(countries.node): 
        colors[u]="#5D4037"
    if "Theme1_keywords" in AllKeywords.keys() and u in list(AllKeywords["Theme1_keywords"]): 
        colors[u]="#1A237E"
    if "Theme2_keywords" in AllKeywords.keys() and u in list(AllKeywords["Theme2_keywords"]): 
        colors[u]="#303F9F"
    if "Theme3_keywords" in AllKeywords.keys() and u in list(AllKeywords["Theme3_keywords"]): 
        colors[u]="#5C6BC0"
    if "Theme4_keywords" in AllKeywords.keys() and u in list(AllKeywords["Theme4_keywords"]): 
        colors[u]="#0D47A1"
    if "Theme5_keywords" in AllKeywords.keys() and u in list(AllKeywords["Theme5_keywords"]): 
        colors[u]="#1976D2"
    if "Theme6_keywords" in AllKeywords.keys() and u in list(AllKeywords["Theme6_keywords"]): 
        colors[u]="#42A5F5"
    if "Theme7_keywords" in AllKeywords.keys() and u in list(AllKeywords["Theme7_keywords"]): 
        colors[u]="#01579B"
    if "Theme8_keywords" in AllKeywords.keys() and u in list(AllKeywords["Theme8_keywords"]): 
        colors[u]="#0288D1"
    if "Theme9_keywords" in AllKeywords.keys() and u in list(AllKeywords["Theme9_keywords"]): 
        colors[u]="#29B6F6"
    if "Theme10_keywords" in AllKeywords.keys() and u in list(AllKeywords["Theme10_keywords"]): 
        colors[u]="#81D4FA"
    if u in list(SDGs.columns[1:41]): 
        colors[u]="#EF5350"
#    if u in list(plans.columns[41:84]): 
#        colors[u]="#BA68C8"
#    if u in list(plans.columns[84:134]): 
#        colors[u]="#4DB6AC"
#    if u in list(plans.columns[134:139]): 
#        colors[u]="#FF8A65"

edge_colors={}
for [u,v,d] in list(G.edges(data=True)):
    if v in list(projs.Nickname_ES): 
        edge_colors[u,v]="#B71C1C" 
    if v in AllYears: 
        edge_colors[u,v]="#FDD835" 
    if v in list(projs.Leader) or v in list(other_leaders.Name) or v in list(collab_people.Name): 
        edge_colors[u,v]="#4A148C"
    if v in AllOrgs: 
        edge_colors[u,v]="#006064"
    # if v in list(orgs_info.Org[orgs_info.Funder=="Y"]): 
    #     edge_colors[u,v]="#494847"
    if v in AllSpecies: 
        edge_colors[u,v]="#F57F17"
    if v in AllIslands: 
        edge_colors[u,v]="#33691E"
    if v in list(countries.node): 
        edge_colors[u,v]="#5D4037"
    if "Theme1_keywords" in AllKeywords.keys() and v in list(AllKeywords["Theme1_keywords"]): 
        edge_colors[u,v]="#1A237E"
    if "Theme2_keywords" in AllKeywords.keys() and v in list(AllKeywords["Theme2_keywords"]): 
        edge_colors[u,v]="#303F9F"
    if "Theme3_keywords" in AllKeywords.keys() and v in list(AllKeywords["Theme3_keywords"]): 
        edge_colors[u,v]="#5C6BC0"
    if "Theme4_keywords" in AllKeywords.keys() and v in list(AllKeywords["Theme4_keywords"]): 
        edge_colors[u,v]="#0D47A1"
    if "Theme5_keywords" in AllKeywords.keys() and v in list(AllKeywords["Theme5_keywords"]): 
        edge_colors[u,v]="#1976D2"
    if "Theme6_keywords" in AllKeywords.keys() and v in list(AllKeywords["Theme6_keywords"]): 
        edge_colors[u,v]="#FF8C00"
    if "Theme7_keywords" in AllKeywords.keys() and v in list(AllKeywords["Theme7_keywords"]): 
        edge_colors[u,v]="#01579B"
    if "Theme8_keywords" in AllKeywords.keys() and v in list(AllKeywords["Theme8_keywords"]): 
        edge_colors[u,v]="#0288D1"
    if "Theme9_keywords" in AllKeywords.keys() and v in list(AllKeywords["Theme9_keywords"]): 
        edge_colors[u,v]="#29B6F6"
    if "Theme10_keywords" in AllKeywords.keys() and v in list(AllKeywords["Theme10_keywords"]): 
        edge_colors[u,v]="#81D4FA"
    if v in list(SDGs.columns[1:41]): 
        edge_colors[u,v]="#EF5350"
#    if v in list(plans.columns[41:84]): 
#        edge_colors[u,v]="#BA68C8"
#    if v in list(plans.columns[84:134]): 
#        edge_colors[u,v]="#4DB6AC"
#    if v in list(plans.columns[134:139]): 
#        edge_colors[u,v]="#FF8A65"

weights = nx.get_edge_attributes(G,'weight').values()
        
#%%Create network

G.nodes(data=True)
G.edges(data=True)    

size=np.repeat(6000,len(projs.Nickname_ES)).tolist()+np.repeat(3000,len(G.nodes)-(len(projs.Nickname_ES))).tolist()

pos = nx.spring_layout(G)
plt.figure(figsize=(35,35))
nx.draw(G,
        node_color=colors.values(),
        node_size=size,
        with_labels = True,
        font_size=40,
        font_weight='bold',
        width = list(weights),
        edge_color=edge_colors.values(),
        arrowstyle="-")
